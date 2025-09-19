import React, { useState } from "react";
import { Table, Select, Button, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Download, Printer, Search, Filter } from "lucide-react";
import type { Document } from "../../../models/document";
import DocumentFilterDrawer from "./DocumentFilterDrawer";

const { Option } = Select;

const AdminDocumentTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);

  // Create a display interface that extends Document with display-specific fields
  interface DocumentDisplay extends Document {
    index: number;
  }

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
    },
    {
      title: "Loại tài liệu",
      dataIndex: "doc_type",
      key: "doc_type",
      align: "center",
      width: 100,
    },
    {
      title: "Trình độ",
      dataIndex: "level",
      key: "level",
      align: "center",
      width: 80,
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
            case "pending":
              return { text: "Chờ duyệt", color: "text-yellow-600" };
            case "approved":
              return { text: "Đã duyệt", color: "text-green-600" };
            case "pending_summary":
              return { text: "Chờ tóm tắt", color: "text-blue-600" };
            case "rejected":
              return { text: "Đã từ chối", color: "text-red-600" };
            case "requested_edit":
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

  // Sample data matching the Document interface
  const data: DocumentDisplay[] = [
    {
      index: 1,
      id: "1",
      user: "user1",
      description: { summary_by_user: "Tài liệu tổng hợp" },
      author: ["Tác giả 1"],
      url: "https://example.com/doc1",
      published_year: 2025,
      publisher: "NXB Giáo dục",
      intensive: false,
      organization: "Đại học Công nghiệp TP.HCM",
      level: "University",
      subject: "Kinh tế chính trị",
      status: "pending",
      public_mode: "public",
      page: 100,
      file_type: "PDF",
      keyword: ["kinh tế", "chính trị"],
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      doc_type: "Textbook",
      view: 0,
      comment_count: 0,
      download_count: 0,
      is_deleted: false,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      index: 2,
      id: "2",
      user: "user2",
      description: { summary_by_user: "Tài liệu tổng hợp" },
      author: ["Tác giả 2"],
      url: "https://example.com/doc2",
      published_year: 2025,
      publisher: "NXB Giáo dục",
      intensive: false,
      organization: "Đại học Công nghiệp TP.HCM",
      level: "University",
      subject: "Kinh tế chính trị",
      status: "approved",
      public_mode: "public",
      page: 120,
      file_type: "PDF",
      keyword: ["kinh tế", "chính trị"],
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      doc_type: "Textbook",
      view: 0,
      comment_count: 0,
      download_count: 0,
      is_deleted: false,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      index: 3,
      id: "3",
      user: "user3",
      description: { summary_by_user: "Tài liệu tổng hợp" },
      author: ["Tác giả 3"],
      url: "https://example.com/doc3",
      published_year: 2025,
      publisher: "NXB Giáo dục",
      intensive: false,
      organization: "Đại học Công nghiệp TP.HCM",
      level: "University",
      subject: "Kinh tế chính trị",
      status: "requested_edit",
      public_mode: "public",
      page: 95,
      file_type: "PDF",
      keyword: ["kinh tế", "chính trị"],
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      doc_type: "Textbook",
      view: 0,
      comment_count: 0,
      download_count: 0,
      is_deleted: false,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      index: 4,
      id: "4",
      user: "user4",
      description: { summary_by_user: "Tài liệu tổng hợp" },
      author: ["Tác giả 4"],
      url: "https://example.com/doc4",
      published_year: 2025,
      publisher: "NXB Giáo dục",
      intensive: false,
      organization: "Đại học Công nghiệp TP.HCM",
      level: "University",
      subject: "Kinh tế chính trị",
      status: "rejected",
      public_mode: "public",
      page: 110,
      file_type: "PDF",
      keyword: ["kinh tế", "chính trị"],
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      doc_type: "Textbook",
      view: 0,
      comment_count: 0,
      download_count: 0,
      is_deleted: false,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
    {
      index: 5,
      id: "5",
      user: "user5",
      description: { summary_by_user: "Tài liệu tổng hợp" },
      author: ["Tác giả 5"],
      url: "https://example.com/doc5",
      published_year: 2025,
      publisher: "NXB Giáo dục",
      intensive: false,
      organization: "Đại học Công nghiệp TP.HCM",
      level: "University",
      subject: "Kinh tế chính trị",
      status: "pending_summary",
      public_mode: "public",
      page: 85,
      file_type: "PDF",
      keyword: ["kinh tế", "chính trị"],
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      doc_type: "Textbook",
      view: 0,
      comment_count: 0,
      download_count: 0,
      is_deleted: true,
      createdAt: "2025-01-01",
      updatedAt: "2025-01-01",
    },
  ];

  // Calculate pagination
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = data.slice(startIndex, endIndex);

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
          <span className="text-sm text-gray-600">50 lọc</span>
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
          //   scroll={{ x: 1200 }}
          rowKey="id"
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
              {startIndex + 1}-{endIndex} of {totalItems}
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
