import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

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
    // Thêm các bài đăng khác ở đây
  ];

  return (
    <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
  );
};

export default PostTable;
