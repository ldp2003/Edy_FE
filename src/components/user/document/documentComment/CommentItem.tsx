import React, { useState } from "react";
import { Avatar, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { Comment } from "../../../../models/comment";
import CommentReportModal from "../../report/CommentReportModal";

interface CommentItemProps {
  comment: Comment;
  documentId: string;
  onReply?: (commentId: string) => void;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  documentId,
  onReply,
  isReply = false,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    if (diffInMinutes < 43200)
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className={`flex gap-3 ${isReply ? "ml-12 mt-3" : "mb-4"}`}>
      {/* Avatar */}
      <Avatar
        size={isReply ? 32 : 40}
        src={comment.user.avatar}
        icon={<UserOutlined />}
        className="flex-shrink-0"
      />

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* User Info + Time + Report */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[var(--secondary-color)] truncate">
              {`${comment.user.first_name} ${comment.user.last_name}`}
            </span>
            <span className="text-xs truncate text-[var(--secondary-text-color)]">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
          <Button
            type="text"
            size="small"
            className="text-xs text-red-400 hover:text-red-600 p-0 h-auto"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 2.5V13.5M3 2.5H13V10.5L10 8.5L7 10.5L3 8.5V2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            }
            title="Báo cáo bình luận"
            onClick={() => setShowReportModal(true)}
          />
        </div>

        {/* Comment Text */}
        <p className="text-xs text-black  mb-2 whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Actions */}
        {!isReply && onReply && (
          <Button
            type="text"
            size="small"
            className="text-xs text-[var(--secondary-text-color)] hover:text-[var(--primary-text-color)] p-0 h-auto"
            onClick={() => onReply(comment._id)}
          >
            Trả lời
          </Button>
        )}
      </div>

      {/* Comment Report Modal */}
      <CommentReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        documentId={documentId}
        commentId={comment._id}
        commentContent={comment.content}
        commentAuthor={`${comment.user.first_name} ${comment.user.last_name}`}
      />
    </div>
  );
};

export default CommentItem;
