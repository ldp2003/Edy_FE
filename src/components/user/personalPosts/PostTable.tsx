import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Trash, Edit } from "lucide-react";

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
            className="p-2  text-white rounded hover:bg-red-600"
            style={{ backgroundColor: "var(--red-button-color)" }}
            onClick={() => console.log("Delete action triggered")}
          >
            <Trash className="w-4 h-4" />
          </button>
          <button
            className="p-2  text-white rounded hover:bg-blue-600"
            style={{ backgroundColor: "var(--green-button-color)" }}
            onClick={() => console.log("Edit action triggered")}
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

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
  ];

  return (
    <div
      className="rounded-md overflow-hidden w-full"
      style={{ border: "1px solid rgba(0, 0, 0, 0.2)" }}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="middle"
      />
      <div
        className="flex justify-between items-center px-4 py-2"
        style={{
          backgroundColor: "var(--page-nav-color)",
        }}
      >
        <span className="text-sm">Số dòng: {data.length}</span>
        <div className="flex gap-2">
          <button className="px-2 py-1 border rounded hover:bg-gray-200">
            &lt;
          </button>
          <span className="text-sm flex items-center">
            1-5 of {data.length}
          </span>
          <button className="px-2 py-1 border rounded hover:bg-gray-200">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostTable;
