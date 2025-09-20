import React, { useState, useEffect } from "react";
import { Table, Select, Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import { Download, Printer, Search, Filter } from "lucide-react";
import type { Document } from "../../../models/document";
import DocumentFilterDrawer from "./DocumentFilterDrawer";
import { DocumentService } from "../../../utils/DocumentService";

const { Option } = Select;

const AdminDocumentTable: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);

  // Fetch documents from API
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await DocumentService.fetchNewestDocuments({
          page: currentPage,
          limit: pageSize,
          ordering: "createdAt",
          order: -1,
        });

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
  }, [currentPage, pageSize]);

  // Create a display interface that extends Document with display-specific fields
  interface DocumentDisplay extends Document {
    index: number;
  }

  const handleRowClick = (record: DocumentDisplay) => {
    navigate(`/admin/documents/review/${record._id}`);
  };

  const columns: ColumnsType<DocumentDisplay> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 60,
    },
    {
      title: "Tên tài liệu",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (text: string, record: DocumentDisplay) => (
        <Button
          type="link"
          onClick={() => handleRowClick(record)}
          className="text-left p-0 h-auto"
          style={{ whiteSpace: "normal", textAlign: "left" }}
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
      width: 100,
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
      width: 80,
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
      width: 80,
      render: (intensive: boolean) => (intensive ? "Có" : "Không"),
    },
    {
      title: "Lượt xem",
      dataIndex: "view",
      key: "view",
      align: "center",
      width: 80,
    },
    {
      title: "Lượt bình luận",
      dataIndex: "comment_count",
      key: "comment_count",
      align: "center",
      width: 120,
    },
    {
      title: "Đánh giá",
      key: "rating",
      align: "center",
      width: 80,
      render: () => "0%", // Placeholder since rating calculation isn't in the model
    },
    {
      title: "Lượt tải",
      dataIndex: "download_count",
      key: "download_count",
      align: "center",
      width: 80,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 120,
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
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
      <div className="flex justify-between items-center">
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

        <div className="flex items-center space-x-2">
          <Button
            icon={<Filter size={14} />}
            size="small"
            type="text"
            onClick={() => setFilterVisible(true)}
          >
            Bộ lọc
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm theo ID và tên"
            className="pl-10"
            size="small"
          />
        </div>
      </div>

      {/* Filter Drawer */}
      <DocumentFilterDrawer
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
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
