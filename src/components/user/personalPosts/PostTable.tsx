import React from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Trash, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  createStatusTag,
  createPublicModeTag,
  createRatingDisplay,
  createFileTypeTag,
} from "../../../locales/translationUtils";

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
      render: (text: string, record: Post) => (
        <span
          onClick={() =>
            navigate(`/personal-posts/document-detail/${record.key}`)
          }
          className="text-[var(--primary-text-color)] font-medium cursor-pointer"
        >
          {text}
        </span>
      ),
      width: "30%",
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
            className="p-2 text-xs text-white rounded bg-[var(--green-button-color)] transition-all duration-300 hover:bg-blue-600 hover:shadow-lg transform hover:scale-105"
            onClick={() => navigate(`/personal-posts/edit/${record.key}`)}
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

  return (
    <div className="rounded-md overflow-hidden w-full border border-[rgba(0,0,0,0.2)]">
      <Table
        columns={columns}
        dataSource={displayData}
        loading={loading}
        pagination={false}
        size="small"
      />
    </div>
  );
};

export default PostTable;
