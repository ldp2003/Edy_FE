import React, { useState } from "react";
import { Table, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Trash, Edit } from "lucide-react";

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
}

const PostTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
    {
      title: "Chế độ",
      dataIndex: "mode",
      key: "mode",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: () => (
        <div className="flex gap-2 justify-center">
          <button
            className="p-2 text-xs text-white rounded bg-[var(--red-button-color)] transition-colors duration-300 hover:bg-red-600"
            onClick={() => console.log("Delete action triggered")}
          >
            <Trash size={15} />
          </button>
          <button
            className="p-2 text-xs text-white rounded bg-[var(--green-button-color)] transition-colors duration-300 hover:bg-blue-600"
            onClick={() => console.log("Edit action triggered")}
          >
            <Edit size={15} />
          </button>
        </div>
      ),
    },
  ];

  // Extended data for demonstration
  const data: Post[] = [
    {
      key: "1",
      index: 1,
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      views: 0,
      comments: 0,
      rating: "0%",
      status: "Đã duyệt",
      mode: "Công khai",
    },
    {
      key: "2",
      index: 2,
      title: "Tài liệu tổng hợp Triết học Mác Lênin",
      views: 10,
      comments: 2,
      rating: "80%",
      status: "Đã duyệt",
      mode: "Công khai",
    },
    {
      key: "3",
      index: 3,
      title: "Tài liệu tổng hợp Lịch sử Đảng",
      views: 5,
      comments: 1,
      rating: "60%",
      status: "Đang chờ duyệt",
      mode: "Công khai",
    },
    {
      key: "4",
      index: 4,
      title: "Tài liệu tổng hợp Kinh tế học",
      views: 20,
      comments: 5,
      rating: "90%",
      status: "Đã duyệt",
      mode: "Cá nhân",
    },
    {
      key: "5",
      index: 5,
      title: "Tài liệu tổng hợp Văn học Việt Nam",
      views: 15,
      comments: 3,
      rating: "70%",
      status: "Từ chối duyệt",
      mode: "Chia sẻ giới hạn",
    },
    {
      key: "6",
      index: 6,
      title: "Tài liệu tổng hợp Toán học cao cấp",
      views: 25,
      comments: 7,
      rating: "95%",
      status: "Đã duyệt",
      mode: "Công khai",
    },
    {
      key: "7",
      index: 7,
      title: "Tài liệu tổng hợp Vật lý đại cương",
      views: 12,
      comments: 4,
      rating: "85%",
      status: "Đã duyệt",
      mode: "Công khai",
    },
    {
      key: "8",
      index: 8,
      title: "Tài liệu tổng hợp Hóa học hữu cơ",
      views: 8,
      comments: 2,
      rating: "75%",
      status: "Đang chờ duyệt",
      mode: "Cá nhân",
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
