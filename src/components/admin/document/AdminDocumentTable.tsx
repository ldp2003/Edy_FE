import React, { useState, useEffect, useRef, useCallback } from "react";
import { Table, Select, Button, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
// import { Download, Printer } from "lucide-react";
import type { Document } from "../../../models/document";
import AdminDocumentFilterSearch, {
  type AdminFilterSearchParams,
} from "./AdminDocumentFilterSearch";
import { DocumentService } from "../../../utils/DocumentService";
import { fetchMultipleDocumentRatings } from "../../../utils/CalcRate";

const { Option } = Select;

// Interface cho ApprovalRequest
interface ApprovalRequest {
  _id: string;
  doc: string;
  requester: string;
  reviewed_by: string | null;
  reviewed_at: Date | null;
  is_summary: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
  ai_checked: boolean;
  ai_violation_level: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  ai_action_suggest: "AUTO_APPROVE" | "MANUAL_REVIEW" | "REJECT";
  ai_reason: string;
  createdAt: string;
  updatedAt: string;
}

const AdminDocumentTable: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  // Đã bỏ viewMode, luôn dùng getAllDocuments
  const [filterParams, setFilterParams] = useState<AdminFilterSearchParams>({});
  const [appliedFilters, setAppliedFilters] = useState<AdminFilterSearchParams>(
    {}
  );
  const [documentRatings, setDocumentRatings] = useState<
    Map<string, { ratingPercentage: number; formattedRating: string }>
  >(new Map());
  const isInitialized = useRef(false);

  // Initialize filter from URL params on mount - only once
  useEffect(() => {
    if (isInitialized.current) return;

    const urlParams: AdminFilterSearchParams = {};

    // Extract all params from URL
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const doc_type = searchParams.get("doc_type");
    const level = searchParams.get("level");
    const intensive = searchParams.get("intensive");
    const published_year = searchParams.get("published_year");
    const ordering = searchParams.get("ordering");
    const order = searchParams.get("order");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    if (search) urlParams.search = search;
    if (status) urlParams.status = status;
    if (doc_type) urlParams.doc_type = doc_type;
    if (level) urlParams.level = level;
    if (intensive) urlParams.intensive = intensive === "true";
    if (published_year) urlParams.published_year = parseInt(published_year);
    if (ordering) urlParams.ordering = ordering;
    if (order) urlParams.order = parseInt(order) as 1 | -1;
    if (start_date && end_date) urlParams.dateRange = [start_date, end_date];
    if (page) setCurrentPage(parseInt(page));
    if (limit) setPageSize(parseInt(limit));

    setFilterParams(urlParams);
    setAppliedFilters(urlParams);
    isInitialized.current = true;
  }, [searchParams]);

  // Fetch documents from API - only when appliedFilters change
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const apiParams = {
          page: currentPage,
          limit: pageSize,
          ordering: appliedFilters.ordering || "createdAt",
          order: appliedFilters.order || -1,
          search: appliedFilters.search,
          status: appliedFilters.status,
          doc_type: appliedFilters.doc_type,
          level: appliedFilters.level,
          intensive: appliedFilters.intensive,
          published_year: appliedFilters.published_year,
          start_date: appliedFilters.dateRange?.[0],
          end_date: appliedFilters.dateRange?.[1],
        };

        const response = await DocumentService.getAllDocuments(apiParams);
        const fetchedDocuments = response.documents || [];

        setDocuments(fetchedDocuments);
        setTotalDocuments(response.total || 0);

        // Fetch ratings cho các documents vừa lấy
        if (fetchedDocuments.length > 0) {
          const documentIds = fetchedDocuments.map((doc: Document) => doc._id);
          const ratingsMap = await fetchMultipleDocumentRatings(documentIds);
          setDocumentRatings(ratingsMap);
        } else {
          setDocumentRatings(new Map());
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        message.error("Không thể tải danh sách tài liệu!");
        setDocuments([]);
        setTotalDocuments(0);
        setDocumentRatings(new Map());
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [currentPage, pageSize, appliedFilters]);

  const handleFilterChange = useCallback(
    (newParams: AdminFilterSearchParams) => {
      // Chỉ cập nhật form filter, không gọi API
      setFilterParams(newParams);
    },
    []
  );

  const updateURLParams = (params: AdminFilterSearchParams) => {
    const newSearchParams = new URLSearchParams();

    if (params.search) newSearchParams.set("search", params.search);
    if (params.status) newSearchParams.set("status", params.status);
    if (params.doc_type) newSearchParams.set("doc_type", params.doc_type);
    if (params.level) newSearchParams.set("level", params.level);
    if (params.intensive !== undefined)
      newSearchParams.set("intensive", params.intensive.toString());
    if (params.published_year)
      newSearchParams.set("published_year", params.published_year.toString());
    if (params.ordering) newSearchParams.set("ordering", params.ordering);
    if (params.order) newSearchParams.set("order", params.order.toString());
    if (params.dateRange?.[0])
      newSearchParams.set("start_date", params.dateRange[0]);
    if (params.dateRange?.[1])
      newSearchParams.set("end_date", params.dateRange[1]);

    newSearchParams.set("page", "1");
    newSearchParams.set("limit", pageSize.toString());

    setSearchParams(newSearchParams);
  };

  const applyFilters = () => {
    setAppliedFilters(filterParams);
    setCurrentPage(1);
    updateURLParams(filterParams);
  };

  // Create a display interface that extends Document with display-specific fields
  interface DocumentDisplay extends Document {
    index: number;
    requestId?: string; // Thêm requestId để lưu ID của đơn duyệt
  }

  const handleRowClick = async (record: DocumentDisplay) => {
    try {
      // Lấy danh sách đơn duyệt của tài liệu này
      const response = await DocumentService.getPendingRequestsByDocument(
        record._id
      );
      const requests = response.requests || [];

      // Lấy đơn duyệt đầu tiên (thường chỉ có 1 đơn PENDING)
      const pendingRequest = requests.find(
        (req: ApprovalRequest) => req.status === "PENDING"
      );
      const requestId = pendingRequest?._id || requests[0]?._id;

      if (requestId) {
        navigate(
          `/admin/documents/review/${record._id}?requestId=${requestId}`
        );
      } else {
        navigate(`/admin/documents/review/${record._id}`);
      }
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      // Fallback về URL cũ nếu có lỗi
      navigate(`/admin/documents/review/${record._id}`);
    }
  };

  const columns: ColumnsType<DocumentDisplay> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      fixed: "left",
    },
    {
      title: "Tên tài liệu",
      dataIndex: "title",
      key: "title",
      fixed: "left",
      render: (text: string, record: DocumentDisplay) => (
        <Button
          type="link"
          onClick={() => handleRowClick(record)}
          className="text-left p-0 h-auto"
          style={{ whiteSpace: "normal", textAlign: "left", color: "black" }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Loại tài liệu",
      dataIndex: "doc_type",
      key: "doc_type",
      align: "center",
      render: (type: string) => {
        const typeConfig: { [key: string]: { text: string; color: string } } = {
          RESEARCH_REPORT: {
            text: "Nghiên cứu",
            color: "bg-blue-100 text-blue-800",
          },
          VIDEO: { text: "Video", color: "bg-red-100 text-red-800" },
          STUDY_GUIDE: {
            text: "Đề cương",
            color: "bg-green-100 text-green-800",
          },
          TEXTBOOK: {
            text: "Giáo trình",
            color: "bg-purple-100 text-purple-800",
          },
          ESSAY: { text: "Tiểu luận", color: "bg-yellow-100 text-yellow-800" },
          SOLUTION_SET: {
            text: "Bài giải",
            color: "bg-orange-100 text-orange-800",
          },
          THESIS: { text: "Luận văn", color: "bg-pink-100 text-pink-800" },
          LECTURE: {
            text: "Bài giảng",
            color: "bg-indigo-100 text-indigo-800",
          },
          OTHER: { text: "Khác", color: "bg-gray-100 text-gray-800" },
        };
        const config = typeConfig[type] || {
          text: type,
          color: "bg-gray-100 text-gray-800",
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
          >
            {config.text}
          </span>
        );
      },
    },
    {
      title: "File",
      dataIndex: "file_type",
      key: "file_type",
      align: "center",
      render: (file_type: string) => {
        const fileTypeConfig: {
          [key: string]: { text: string; color: string };
        } = {
          PDF: { text: "PDF", color: "bg-red-100 text-red-700" },
          WORD: { text: "Word", color: "bg-blue-100 text-blue-700" },
          EXCEL: { text: "Excel", color: "bg-green-100 text-green-700" },
          POWERPOINT: { text: "PPT", color: "bg-orange-100 text-orange-700" },
          VIDEO: { text: "Video", color: "bg-purple-100 text-purple-700" },
        };
        const config = fileTypeConfig[file_type] || {
          text: file_type,
          color: "bg-gray-100 text-gray-700",
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.color}`}
          >
            {config.text}
          </span>
        );
      },
    },
    {
      title: "Trình độ",
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (level: string) => {
        const levelConfig: { [key: string]: { text: string; color: string } } =
          {
            STUDENT: { text: "Học sinh", color: "bg-cyan-100 text-cyan-800" },
            UNIVERSITY: { text: "Đại học", color: "bg-blue-100 text-blue-800" },
            LECTURER: {
              text: "Giảng viên",
              color: "bg-green-100 text-green-800",
            },
            RESEARCHER: {
              text: "Nghiên cứu sinh",
              color: "bg-purple-100 text-purple-800",
            },
            OTHER: { text: "Khác", color: "bg-gray-100 text-gray-800" },
          };
        const config = levelConfig[level] || {
          text: level,
          color: "bg-gray-100 text-gray-800",
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
          >
            {config.text}
          </span>
        );
      },
    },
    {
      title: "Chuyên sâu",
      dataIndex: "intensive",
      key: "intensive",
      align: "center",
      render: (intensive: boolean) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            intensive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {intensive ? "Có" : "Không"}
        </span>
      ),
    },
    {
      title: "Lượt xem",
      dataIndex: "view",
      key: "view",
      align: "center",
    },
    {
      title: "Lượt bình luận",
      dataIndex: "comment_count",
      key: "comment_count",
      align: "center",
    },
    {
      title: "Đánh giá",
      key: "rating",
      align: "center",
      render: (_, record: DocumentDisplay) => {
        const rating = documentRatings.get(record._id);
        if (!rating) {
          return <span className="text-gray-400">-</span>;
        }

        const percentage = rating.ratingPercentage;
        let colorClass = "text-gray-600";

        if (percentage >= 90) colorClass = "text-green-600 font-semibold";
        else if (percentage >= 70) colorClass = "text-blue-600 font-medium";
        else if (percentage >= 50) colorClass = "text-yellow-600";
        else if (percentage >= 30) colorClass = "text-orange-600";
        else if (percentage > 0) colorClass = "text-red-600";

        return (
          <span
            className={colorClass}
            title={`${rating.ratingPercentage}% tích cực`}
          >
            {rating.formattedRating}
          </span>
        );
      },
    },
    {
      title: "Lượt tải",
      dataIndex: "download_count",
      key: "download_count",
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      render: (status: string) => {
        const statusConfig: { [key: string]: { text: string; color: string } } =
          {
            PENDING: {
              text: "Chờ duyệt",
              color: "bg-yellow-100 text-yellow-800",
            },
            APPROVED: {
              text: "Đã duyệt",
              color: "bg-green-100 text-green-800",
            },
            PENDING_SUMMARY: {
              text: "Chờ tóm tắt",
              color: "bg-blue-100 text-blue-800",
            },
            REJECTED: { text: "Đã từ chối", color: "bg-red-100 text-red-800" },
            REQUESTED_EDIT: {
              text: "Chờ chỉnh sửa",
              color: "bg-orange-100 text-orange-800",
            },
          };
        const config = statusConfig[status] || {
          text: status,
          color: "bg-gray-100 text-gray-800",
        };
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
          >
            {config.text}
          </span>
        );
      },
    },
  ];

  // Transform API data to display format
  const getDisplayData = (): DocumentDisplay[] => {
    return documents.map((doc, index) => ({
      ...doc,
      index: (currentPage - 1) * pageSize + index + 1,
    }));
  };

  // Calculate pagination
  const currentData = getDisplayData();
  const totalPages = Math.ceil(totalDocuments / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalDocuments);

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);

    // Update URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("limit", value.toString());
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", newPage.toString());
      setSearchParams(newSearchParams);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", newPage.toString());
      setSearchParams(newSearchParams);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="space-y-4">
      {/* Filter & Search Component */}
      <AdminDocumentFilterSearch
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        loading={loading}
        initialFilters={filterParams}
      />

      {/* Table */}
      <div className="rounded-md overflow-hidden w-full border border-[rgba(0,0,0,0.2)]">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={currentData}
          pagination={false}
          size="small"
          loading={loading}
          rowKey="_id"
          scroll={{ x: "max-content" }}
          bordered
          sticky={{ offsetHeader: 0 }}
          onRow={(record) => ({
            style: { cursor: "pointer" },
            onClick: () => handleRowClick(record),
          })}
        />

        {/* Footer with pagination */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Số dòng:</span>
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              size="small"
              style={{ width: 70 }}
            >
              <Option value={5}>5</Option>
              <Option value={10}>10</Option>
              <Option value={20}>20</Option>
              <Option value={50}>50</Option>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">
              {startIndex + 1}-{endIndex} of {totalDocuments}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDocumentTable;
