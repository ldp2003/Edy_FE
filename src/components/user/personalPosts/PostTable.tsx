import React, { useState } from "react";
import { Table, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Trash, Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  createStatusTag,
  createPublicModeTag,
  createRatingDisplay,
  createFileTypeTag,
} from "../../../locales/translationUtils";

const { Option } = Select;

interface Post {
  key: string;
  index: number;
  title: string;
  views: number;
  comments: number;
  rating: string;
  status: string;
  mode: string;
  public_mode: string;
  url: string;
  createdAt: string;
}

interface PostTableProps {
  data: Post[];
  loading?: boolean;
}

const PostTable: React.FC<PostTableProps> = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  const columns: ColumnsType<Post> = [
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
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
      align: "center",
    },
    {
      title: "Lượt bình luận",
      dataIndex: "comments",
      key: "comments",
      align: "center",
    },
    {
      title: "Loại file",
      dataIndex: "mode",
      key: "mode",
      align: "center",
      render: (fileType: string) => createFileTypeTag(fileType),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      align: "center",
      render: (rating: string) => createRatingDisplay(rating),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => createStatusTag(status),
    },
    {
      title: "Chế độ",
      dataIndex: "public_mode",
      key: "public_mode",
      align: "center",
      render: (mode: string) => createPublicModeTag(mode),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <button
            className="p-2 text-xs text-[var(--primary-color)] rounded-lg border-[var(--primary-color)] cursor-pointer border-1 transition-all duration-300 hover:bg-blue-600 hover:text-white hover:shadow-lg transform hover:scale-105"
            onClick={() => navigate(`/personal-posts/document-detail/${record.key}`)}
            title="Xem chi tiết tài liệu"
          >
            <Eye size={15} color="var(--primary-color)" />
          </button>
          <button
            className="p-2 text-xs text-white rounded bg-[var(--green-button-color)] transition-all duration-300 hover:bg-blue-600 hover:shadow-lg transform hover:scale-105"
            onClick={() => console.log("Edit action triggered")}
            title="Chỉnh sửa tài liệu"
          >
            <Edit size={15} />
          </button>
          <button
            className="p-2 text-xs text-white rounded bg-[var(--red-button-color)] transition-all duration-300 hover:bg-red-600 hover:shadow-lg transform hover:scale-105"
            onClick={() => console.log("Delete action triggered")}
            title="Xóa tài liệu"
          >
            <Trash size={15} />
          </button>
        </div>
      ),
    },
  ];

  // Nếu loading, hiển thị skeleton hoặc rỗng
  const displayData = loading ? [] : data;

  // Calculate pagination
  const totalItems = displayData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = displayData.slice(startIndex, endIndex);

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1); // Reset to first page when changing page size
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

  return (
    <div className="rounded-md overflow-hidden w-full border border-[rgba(0,0,0,0.2)]">
      <Table
        columns={columns}
        dataSource={currentData}
        pagination={false}
        size="small"
      />

      {/* Footer with pagination info */}
      <div className="flex justify-between items-center px-4 py-3 bg-[var(--page-nav-color)] border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hiển thị:</span>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            size="small"
            style={{ width: 70 }}
            className="text-sm"
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
            <Option value={totalItems}>Tất cả</Option>
          </Select>
          <span className="text-sm text-gray-600">dòng</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
            Hiển thị {startIndex + 1}-{endIndex} của {totalItems} dòng
          </span>
          <div className="flex items-center gap-1">
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              ‹ Trước
            </button>
            <span className="text-sm flex items-center px-3 py-1 bg-white border-t border-b border-gray-300 min-w-[80px] justify-center">
              {currentPage} / {totalPages}
            </span>
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Sau ›
            </button>
          </div>
        </div>

        <span className="text-sm text-gray-600">
          Tổng:{" "}
          <span className="font-semibold text-blue-600">{totalItems}</span> tài
          liệu
        </span>
      </div>
    </div>
  );
};

export default PostTable;
