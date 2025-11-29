import React, { useState, useContext } from "react";
import { Avatar, Button, Dropdown, Menu, Modal, Input, message } from "antd";
import {
  UserOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import type { Comment } from "../../../../models/comment";
import CommentReportModal from "../../report/CommentReportModal";
import { UserContext } from "../../../../contexts/UserContext";
import { CommentService } from "../../../../utils/CommentService";

interface CommentItemProps {
  comment: Comment;
  documentId: string;
  onReply?: (commentId: string) => void;
  isReply?: boolean;
  onCommentsUpdate?: (updatedComments: Comment[]) => void;
  allComments?: Comment[];
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  documentId,
  onReply,
  isReply = false,
  onCommentsUpdate,
  allComments = [],
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useContext(UserContext);
  const [messageApi, contextHolder] = message.useMessage();

  const isCurrentUser = user && comment.user._id === user._id;
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

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;

    try {
      const response = await CommentService.updateComment(comment._id, {
        content: editContent.trim(),
      });

      if (response.success && onCommentsUpdate) {
        // Update the comment content locally in the comments list
        const updatedComments = allComments.map((c) => {
          if (c._id === comment._id) {
            return {
              ...c,
              content: editContent.trim(),
              updatedAt: new Date().toISOString(),
            };
          }
          // Also check replies
          if (c.replies) {
            return {
              ...c,
              replies: c.replies.map((reply) =>
                reply._id === comment._id
                  ? {
                      ...reply,
                      content: editContent.trim(),
                      updatedAt: new Date().toISOString(),
                    }
                  : reply
              ),
            };
          }
          return c;
        });

        // Call the parent callback with updated comments
        onCommentsUpdate(updatedComments);
        messageApi.success("Đã cập nhật bình luận thành công!");
      } else {
        messageApi.error("Không thể cập nhật bình luận. Vui lòng thử lại!");
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comment:", error);
      messageApi.error("Có lỗi xảy ra khi cập nhật bình luận!");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await CommentService.deleteComment(comment._id);

      if (onCommentsUpdate) {
        // Remove the comment from the comments list locally
        const updatedComments = allComments
          .filter((c) => c._id !== comment._id) // Remove the comment if it's a parent
          .map((c) => {
            // Also remove from replies if it's a reply
            if (c.replies) {
              return {
                ...c,
                replies: c.replies.filter((reply) => reply._id !== comment._id),
                reply_count: Math.max(0, (c.reply_count || 0) - 1),
              };
            }
            return c;
          });

        // Call the parent callback with updated comments
        onCommentsUpdate(updatedComments);
      }

      setShowDeleteModal(false);
      messageApi.success("Đã gỡ bình luận thành công!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      messageApi.error("Có lỗi xảy ra khi gỡ bình luận!");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={handleEdit}>
        Sửa
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={handleDelete}
        danger
      >
        Gỡ
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {contextHolder}
      <div className={`flex gap-3 ${isReply ? "ml-12 mt-3" : "mb-4"}`}>
        {/* Avatar */}
        <Avatar
          size={isReply ? 32 : 40}
          src={comment.user.avatar}
          icon={<UserOutlined />}
          className="flex-shrink-0"
        />

        {/* Comment Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          {/* User Info + Time + Report/Edit Menu */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Link
                to={`/user/${comment.user._id}`}
                className="font-bold text-sm text-[var(--secondary-color)] truncate max-w-[120px] hover:text-[var(--primary-color)] transition-colors"
              >
                {`${comment.user.first_name} ${comment.user.last_name}`}
              </Link>
              <span className="text-xs text-[var(--secondary-text-color)] flex-shrink-0">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
            {isCurrentUser ? (
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button
                  type="text"
                  size="small"
                  className="text-xs text-[var(--secondary-text-color)] hover:text-[var(--primary-text-color)] p-0 h-auto flex-shrink-0 ml-2"
                  icon={<MoreOutlined />}
                />
              </Dropdown>
            ) : (
              <Button
                type="text"
                size="small"
                className="text-xs text-red-400 hover:text-red-600 p-0 h-auto flex-shrink-0 ml-2"
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
            )}
          </div>

          {/* Comment Text */}
          {isEditing ? (
            <div className="mb-2">
              <Input.TextArea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={2}
                className="text-xs mb-2"
                maxLength={1000}
              />
              <div className="flex gap-2">
                <Button
                  type="primary"
                  size="small"
                  onClick={handleSaveEdit}
                  disabled={!editContent.trim()}
                >
                  Lưu
                </Button>
                <Button type="text" size="small" onClick={handleCancelEdit}>
                  Hủy
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-black mb-2 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          )}

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

        {/* Delete Confirmation Modal */}
        <Modal
          title="Xác nhận gỡ bình luận"
          open={showDeleteModal}
          onOk={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          okText="Gỡ"
          cancelText="Hủy"
          okType="danger"
        >
          <p>Bạn có chắc chắn muốn gỡ bình luận này không?</p>
        </Modal>

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
    </>
  );
};

export default CommentItem;
