/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getDocumentTypeStyle,
  getFileTypeStyle,
  getLevelStyle,
  getStatusStyle,
  getWarningStyle,
} from "../../../utils/AdminTableStyles";
import React, { useState, useEffect, useCallback } from "react";
import { Table, Select, message, Dropdown, Checkbox } from "antd";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
// import { Download, Printer } from "lucide-react";
import type { Document } from "../../../models/document";
import { publicModeLabels } from "../../../models/document";
import AdminDocumentFilterSearch, {
  type AdminFilterSearchParams,
} from "./AdminDocumentFilterSearch";
import { DocumentService } from "../../../utils/DocumentService";
import { calculateDocumentRating } from "../../../utils/CalcRate";
import { Eye } from "lucide-react";

const { Option } = Select;

// Interface cho ApprovalRequest
interface ApprovalRequest {
  _id: string;
  doc: string;
  requester: string;
  reviewed_by: string | null;
  reviewed_at: Date | null;
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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  // Đã bỏ viewMode, luôn dùng getAllDocuments
  const [filterParams, setFilterParams] = useState<AdminFilterSearchParams>({});
  const [appliedFilters, setAppliedFilters] = useState<AdminFilterSearchParams>(
    {}
  );

  // Sorting state
  const [sortInfo, setSortInfo] = useState<{
    field: string | null;
    order: "ascend" | "descend" | null;
  }>({ field: null, order: null });

  // State for column visibility
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set([
      "index",
      "title",
      "doc_type",
      "file_type",
      "level",
      "intensive",
      "view",
      "comment_count",
      "rating",
      "download_count",
      "createdAt",
      "user",
      "public_mode",
      "status",
      "organization",
      "subject",
      "page",
      "updatedAt",
    ])
  );

  // Load column visibility from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("adminDocumentTableVisibleColumns");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setVisibleColumns(new Set(parsed));
      } catch (error) {
        console.error("Error loading column visibility:", error);
      }
    }
  }, []);

  // Save column visibility to localStorage
  const saveColumnVisibility = (columns: Set<string>) => {
    localStorage.setItem(
      "adminDocumentTableVisibleColumns",
      JSON.stringify([...columns])
    );
  };

  // Toggle column visibility
  const toggleColumnVisibility = (columnKey: string, checked: boolean) => {
    const newVisibleColumns = new Set(visibleColumns);
    if (checked) {
      newVisibleColumns.add(columnKey);
    } else {
      // Don't allow hiding essential columns
      if (columnKey === "title" || columnKey === "status") {
        message.warning("Không thể ẩn cột Tên tài liệu và Trạng thái!");
        return;
      }
      newVisibleColumns.delete(columnKey);
    }
    setVisibleColumns(newVisibleColumns);
    saveColumnVisibility(newVisibleColumns);
  };

  // Initialize filter from URL params on mount and when URL changes
  useEffect(() => {
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
  }, [searchParams]);

  // Fetch documents from API - only when appliedFilters, currentPage, pageSize, or sortInfo change
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        // Build ordering parameter
        let ordering = appliedFilters.ordering || "createdAt";
        let order: 1 | -1 = appliedFilters.order || -1;

        if (sortInfo.field && sortInfo.order) {
          ordering = sortInfo.field;
          order = sortInfo.order === "ascend" ? 1 : -1;
        }

        const apiParams = {
          page: currentPage,
          limit: pageSize,
          ordering,
          order,
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
  }, [currentPage, pageSize, appliedFilters, sortInfo]);

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
      width: 200,
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: DocumentDisplay) => (
        <span
          onClick={() => handleRowClick(record)}
          className="line-clamp-1"
          style={{
            overflow: "hidden",
            textAlign: "left",
            color: "var(--primary-text-color)",
            fontWeight: 500,
            cursor: "pointer",
          }}
          title={text}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Loại tài liệu",
      dataIndex: "doc_type",
      key: "doc_type",
      align: "center",
      render: (type: string) => {
        const typeLabels: { [key: string]: string } = {
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
        const text = typeLabels[type] || type;
        return (
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={getDocumentTypeStyle(type)}
          >
            {text}
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
        const fileTypeLabels: { [key: string]: string } = {
          PDF: "PDF",
          WORD: "Word",
          EXCEL: "Excel",
          POWERPOINT: "PPT",
          VIDEO: "Video",
        };
        const text = fileTypeLabels[file_type] || file_type;
        return (
          <span
            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
            style={getFileTypeStyle(file_type)}
          >
            {text}
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
        const levelLabels: { [key: string]: string } = {
          STUDENT: "Học sinh",
          UNIVERSITY: "Đại học",
          LECTURER: "Giảng viên",
          RESEARCHER: "Nghiên cứu sinh",
          OTHER: "Khác",
        };
        const text = levelLabels[level] || level;
        return (
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={getLevelStyle(level)}
          >
            {text}
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
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          style={intensive ? getStatusStyle("approved") : getWarningStyle()}
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
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Bình luận",
      dataIndex: "comment_count",
      key: "comment_count",
      align: "center",
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Đánh giá",
      key: "rating",
      align: "center",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (_, record: DocumentDisplay) => {
        const rating = calculateDocumentRating(
          record.like || 0,
          record.dislike || 0
        );
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
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      sortDirections: ["ascend", "descend"],
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
      title: "Người đăng tải",
      dataIndex: "user",
      key: "user",
      align: "center",
      render: (user: {
        avatar: string;
        first_name: string;
        last_name: string;
      }) => {
        if (!user) return "N/A";
        return (
          <div className="flex items-center gap-2">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-left">{`${user.first_name} ${user.last_name}`}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Chế độ",
      dataIndex: "public_mode",
      key: "public_mode",
      align: "center",
      render: (mode: string) => {
        const text =
          publicModeLabels[mode as keyof typeof publicModeLabels] || mode;
        let color = "var(--secondary-color)"; // default
        switch (mode) {
          case "PUBLIC":
            color = "var(--green-button-color)"; // xanh lá
            break;
          case "PRIVATE":
            color = "var(--red-button-color)"; // đỏ
            break;
          case "PRIVATE_SHARED":
            color = "var(--primary-color)"; // xanh dương
            break;
          case "SHARE_ORGANIZATION":
            color = "var(--favorite-color)"; // vàng
            break;
        }
        return (
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: color, color: "white" }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      fixed: "right",
      render: (status: string) => {
        const statusLabels: { [key: string]: string } = {
          PENDING: "Chờ duyệt",
          APPROVED: "Đã duyệt",
          REJECTED: "Đã từ chối",
          REQUESTED_EDIT: "Chờ chỉnh sửa",
          PENDING_EDIT: "Chờ duyệt chỉnh sửa",
        };
        const text = statusLabels[status] || status;
        return (
          <span
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
            style={getStatusStyle(status.toLowerCase())}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      align: "center",
      render: (author: string[]) => {
        if (!author || author.length === 0) return "N/A";
        return (
          <span className="text-sm" title={author.join(", ")}>
            {author.join(", ")}
          </span>
        );
      },
    },
    {
      title: "Bìa",
      dataIndex: "cover_page",
      key: "cover_page",
      align: "center",
      render: (cover_page: string) => {
        if (!cover_page) return "N/A";
        return (
          <img
            src={cover_page}
            alt="Cover"
            className="w-12 h-12 object-cover rounded"
          />
        );
      },
    },
    {
      title: "Không thích",
      dataIndex: "dislike",
      key: "dislike",
      align: "center",
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Ngày duyệt cuối",
      dataIndex: "last_approved_at",
      key: "last_approved_at",
      align: "center",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text: string) => {
        if (!text) return "N/A";
        const date = new Date(text);
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "Tổ chức",
      dataIndex: "organization",
      key: "organization",
      align: "center",
      render: (organization: { name: string }) => {
        if (!organization) return "N/A";
        return (
          <span className="text-sm" title={organization.name}>
            {organization.name}
          </span>
        );
      },
    },
    {
      title: "Số trang",
      dataIndex: "page",
      key: "page",
      align: "center",
      sorter: true,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Năm xuất bản",
      dataIndex: "published_year",
      key: "published_year",
      align: "center",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (year: number) => year || "N/A",
    },
    {
      title: "Nhà xuất bản",
      dataIndex: "publisher",
      key: "publisher",
      align: "center",
      render: (publisher: string) => publisher || "N/A",
    },
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      align: "center",
      render: (subject: { name: string }) => {
        if (!subject) return "N/A";
        return (
          <span className="text-sm" title={subject.name}>
            {subject.name}
          </span>
        );
      },
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center",
      sorter: true,
      sortDirections: ["ascend", "descend"],
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      title: "Liên kết file",
      dataIndex: "url",
      key: "url",
      align: "center",
      render: (url: string) => {
        if (!url) return "N/A";
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Xem file
          </a>
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

  // Handle table change (sorting, pagination, etc.)
  const handleTableChange = (_pagination: any, _filters: any, sorter: any) => {
    if (sorter.field && sorter.order) {
      setSortInfo({
        field: sorter.field,
        order: sorter.order,
      });
    } else {
      setSortInfo({ field: null, order: null });
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

  // Filter columns based on visibility
  const filteredColumns = columns.filter((column) =>
    visibleColumns.has(column.key as string)
  );

  // Column options for visibility toggle
  const columnOptions = [
    { key: "index", label: "STT" },
    { key: "title", label: "Tên tài liệu", disabled: true },
    { key: "doc_type", label: "Loại tài liệu" },
    { key: "file_type", label: "File" },
    { key: "level", label: "Trình độ" },
    { key: "intensive", label: "Chuyên sâu" },
    { key: "view", label: "Lượt xem" },
    { key: "comment_count", label: "Lượt bình luận" },
    { key: "rating", label: "Đánh giá" },
    { key: "download_count", label: "Lượt tải" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "user", label: "Người đăng tải" },
    { key: "public_mode", label: "Chế độ" },
    { key: "status", label: "Trạng thái", disabled: true },
    { key: "author", label: "Tác giả" },
    { key: "cover_page", label: "Bìa" },
    { key: "dislike", label: "Không thích" },
    { key: "last_approved_at", label: "Ngày duyệt cuối" },
    { key: "organization", label: "Tổ chức" },
    { key: "page", label: "Số trang" },
    { key: "published_year", label: "Năm xuất bản" },
    { key: "publisher", label: "Nhà xuất bản" },
    { key: "subject", label: "Môn học" },
    { key: "updatedAt", label: "Ngày cập nhật" },
    { key: "url", label: "Liên kết file" },
  ];

  // Dropdown menu for column visibility
  const columnVisibilityMenu = {
    items: columnOptions.map((option) => ({
      key: option.key,
      label: (
        <Checkbox
          checked={visibleColumns.has(option.key)}
          disabled={option.disabled}
          onChange={(e) => toggleColumnVisibility(option.key, e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        >
          {option.label}
        </Checkbox>
      ),
    })),
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

      {/* Table Header with Column Visibility Controls */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-[var(--primary-text-color)]">
          Danh sách tài liệu
        </h3>
        <Dropdown
          menu={columnVisibilityMenu}
          placement="bottomRight"
          trigger={["click"]}
        >
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Eye size={16} />
            <span className="text-sm">Ẩn/Hiện cột</span>
          </button>
        </Dropdown>
      </div>

      {/* Table */}
      <div className="rounded-md overflow-hidden w-full border border-[rgba(0,0,0,0.2)]">
        <Table
          columns={filteredColumns}
          dataSource={currentData}
          pagination={false}
          size="small"
          loading={loading}
          rowKey="_id"
          scroll={{ x: "max-content" }}
          bordered
          sticky={{ offsetHeader: 0 }}
          onChange={handleTableChange}
          onRow={(record) => ({
            style: { cursor: "pointer" },
            onMouseEnter: (e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
              e.currentTarget.style.transition = "background-color 0.2s ease";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.backgroundColor = "";
            },
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
