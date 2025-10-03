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
  content_rejection?: {
    message: string;
  };
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
      render: (text: string, record: Post) => {
        const isRejected = record.status === "REJECTED";
        const isRequestedEdit =
          record.status === "REQUESTED_EDIT" ||
          record.status === "PENDING_EDIT";
        const hasRejectionMessage = record.content_rejection?.message;
        const showRejectionReason =
          (isRejected || isRequestedEdit) && hasRejectionMessage;

        return (
          <div
            onClick={
              isRejected
                ? undefined
                : () =>
                    navigate(`/personal-posts/document-detail/${record.key}`)
            }
            className={isRejected ? "cursor-not-allowed" : "cursor-pointer"}
          >
            <div
              className={`text-[var(--primary-text-color)] font-medium ${
                isRejected ? "line-through text-gray-400" : ""
              }`}
              style={{ fontSize: isRejected ? "12px" : "14px" }}
            >
              {text}
            </div>
            {showRejectionReason && (
              <div
                style={{
                  fontSize: "11px",
                  color: isRejected ? "#e74c3c" : "#f39c12",
                  fontStyle: "italic",
                  marginTop: "4px",
                }}
              >
                {isRejected ? "Lý do từ chối" : "Yêu cầu chỉnh sửa"}:{" "}
                {record.content_rejection?.message}
              </div>
            )}
          </div>
        );
      },
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
      render: (_, record) => {
        const isRejected = record.status === "REJECTED";
        return (
          <div className="flex gap-2 justify-center">
            <button
              className={`p-2 text-xs text-white rounded transition-all duration-300 ${
                isRejected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--green-button-color)] hover:bg-blue-600 hover:shadow-lg transform hover:scale-105"
              }`}
              onClick={
                isRejected
                  ? undefined
                  : () => navigate(`/personal-posts/edit/${record.key}`)
              }
              title={
                isRejected
                  ? "Không thể sửa tài liệu bị từ chối"
                  : "Chỉnh sửa tài liệu"
              }
              disabled={isRejected}
            >
              <Edit size={15} />
            </button>
            <button
              className={`p-2 text-xs text-white rounded transition-all duration-300 ${
                isRejected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--red-button-color)] hover:bg-red-600 hover:shadow-lg transform hover:scale-105"
              }`}
              onClick={
                isRejected
                  ? undefined
                  : () => console.log("Delete action triggered")
              }
              title={
                isRejected
                  ? "Không thể xóa tài liệu bị từ chối"
                  : "Xóa tài liệu"
              }
              disabled={isRejected}
            >
              <Trash size={15} />
            </button>
          </div>
        );
      },
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
