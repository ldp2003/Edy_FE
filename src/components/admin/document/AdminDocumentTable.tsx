import React, { useState, useEffect } from "react";
import { Table, Select, Button, message } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
// import { Download, Printer } from "lucide-react";
import type { Document } from "../../../models/document";
import AdminDocumentFilterSearch, {
  type AdminFilterSearchParams,
} from "./AdminDocumentFilterSearch";
import { DocumentService } from "../../../utils/DocumentService";

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

  // Initialize filter from URL params on mount
  useEffect(() => {
    const urlParams: AdminFilterSearchParams = {};

    // Extract all params from URL
    const title = searchParams.get("title");
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

    if (title) urlParams.title = title;
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
  }, [searchParams]);

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const apiParams = {
          page: currentPage,
          limit: pageSize,
          ordering: filterParams.ordering || "createdAt",
          order: filterParams.order || -1,
          title: filterParams.title,
          status: filterParams.status,
          doc_type: filterParams.doc_type,
          level: filterParams.level,
          intensive: filterParams.intensive,
          published_year: filterParams.published_year,
          start_date: filterParams.dateRange?.[0],
          end_date: filterParams.dateRange?.[1],
        };

        const response = await DocumentService.getAllDocuments(apiParams);

        setDocuments(response.documents || []);
        setTotalDocuments(response.total || 0);
      } catch (error) {
        console.error("Error fetching documents:", error);
        message.error("Không thể tải danh sách tài liệu!");
        setDocuments([]);
        setTotalDocuments(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [currentPage, pageSize, filterParams]);

  const handleFilterChange = (newParams: AdminFilterSearchParams) => {
    setFilterParams(newParams);
    setCurrentPage(1);

    // Update URL params
    const newSearchParams = new URLSearchParams();

    if (newParams.title) newSearchParams.set("title", newParams.title);
    if (newParams.status) newSearchParams.set("status", newParams.status);
    if (newParams.doc_type) newSearchParams.set("doc_type", newParams.doc_type);
    if (newParams.level) newSearchParams.set("level", newParams.level);
    if (newParams.intensive !== undefined)
      newSearchParams.set("intensive", newParams.intensive.toString());
    if (newParams.published_year)
      newSearchParams.set(
        "published_year",
        newParams.published_year.toString()
      );
    if (newParams.ordering) newSearchParams.set("ordering", newParams.ordering);
    if (newParams.order)
      newSearchParams.set("order", newParams.order.toString());
    if (newParams.dateRange?.[0])
      newSearchParams.set("start_date", newParams.dateRange[0]);
    if (newParams.dateRange?.[1])
      newSearchParams.set("end_date", newParams.dateRange[1]);

    newSearchParams.set("page", "1");
    newSearchParams.set("limit", pageSize.toString());

    setSearchParams(newSearchParams);
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
        const typeMap: { [key: string]: string } = {
          RESEARCH_REPORT: "Nghiên cứu",
          VIDEO: "Video",
          STUDY_GUIDE: "Đề cương",
          TEXTBOOK: "Giáo trình",
          ESSAY: "Tiểu luận",
          SOLUTION_SET: "Bài giải",
          THESIS: "Luận văn",
          LECTURE: "Bài giảng",
          OTHER: "Khác",
        };
        return typeMap[type] || type;
      },
    },
    {
      title: "Trình độ",
      dataIndex: "level",
      key: "level",
      align: "center",
      render: (level: string) => {
        const levelMap: { [key: string]: string } = {
          STUDENT: "Học sinh",
          UNIVERSITY: "Đại học",
          LECTURER: "Giảng viên",
          RESEARCHER: "Nghiên cứu sinh",
          OTHER: "Khác",
        };
        return levelMap[level] || level;
      },
    },
    {
      title: "Chuyên sâu",
      dataIndex: "intensive",
      key: "intensive",
      align: "center",
      render: (intensive: boolean) => (intensive ? "Có" : "Không"),
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
      render: () => "0%", // Placeholder since rating calculation isn't in the model
    },
    {
      title: "Lượt tải",
      dataIndex: "download_count",
      key: "download_count",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      render: (status: string) => {
        const getStatusDisplay = (status: string) => {
          switch (status) {
            case "PENDING":
              return { text: "Chờ duyệt", color: "text-yellow-600" };
            case "APPROVED":
              return { text: "Đã duyệt", color: "text-green-600" };
            case "PENDING_SUMMARY":
              return { text: "Chờ tóm tắt", color: "text-blue-600" };
            case "REJECTED":
              return { text: "Đã từ chối", color: "text-red-600" };
            case "REQUESTED_EDIT":
              return { text: "Chờ chỉnh sửa", color: "text-orange-600" };
            default:
              return { text: status, color: "text-gray-600" };
          }
        };

        const { text, color } = getStatusDisplay(status);
        return <span className={`font-medium ${color}`}>{text}</span>;
      },
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
      {/* Header Controls */}
      {/* <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Select defaultValue="2025" size="small" style={{ width: 80 }}>
            <Option value="2025">2025</Option>
            <Option value="2024">2024</Option>
          </Select>
          <Button icon={<Download size={14} />} size="small">
            Download
          </Button>
          <Button icon={<Printer size={14} />} size="small">
            Print
          </Button>
        </div>
      </div> */}

      {/* Filter & Search Component */}
      <AdminDocumentFilterSearch
        onFilterChange={handleFilterChange}
        loading={loading}
        initialFilters={filterParams}
      />

      {/* Table */}
      <div className="rounded-md overflow-hidden border border-gray-200">
        <style>
          {`
            .ant-table-tbody > tr > td {
              font-size: 11px !important;
            }
            .ant-table-thead > tr > th {
              font-size: 11px !important;
            }
            .ant-table-container .ant-table-body,
            .ant-table-container .ant-table-content {
              scrollbar-width: thin;
              scrollbar-color: #eaeaea transparent;
              scrollbar-gutter: stable;
            }
          `}
        </style>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={currentData}
          pagination={false}
          size="small"
          loading={loading}
          rowKey="_id"
          scroll={{ x: "max-content" }}
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
