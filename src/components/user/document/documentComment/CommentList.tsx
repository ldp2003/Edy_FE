import React, { useContext, useState } from "react";
import { Button, Input, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import CommentItem from "./CommentItem";
import type { Comment } from "../../../../models/comment";
import { CommentService } from "../../../../utils/CommentService";
import { NotificationService } from "../../../../utils/NotificationService";
import { UserContext } from "../../../../contexts/UserContext";

const { TextArea } = Input;

interface CommentListProps {
  documentId: string;
  documentOwnerId?: string;
  comments: Comment[];
  onAddComment?: (content: string, parentId?: string) => Promise<void>;
  onCommentsUpdate?: (updatedComments: Comment[]) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  documentId,
  documentOwnerId,
  comments,
  onAddComment,
  onCommentsUpdate,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, number>
  >({});
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useContext(UserContext);

  // Với API mới, comments đã được nhóm sẵn với replies array
  const parentComments = comments.filter((comment) => !comment.parent);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      messageApi.warning("Vui lòng nhập nội dung bình luận!");
      return;
    }

    setLoading(true);
    try {
      // Ưu tiên sử dụng service trước, fallback về callback
      if (onCommentsUpdate) {
        await handleAddCommentService(newComment.trim());
        setNewComment("");
      } else if (onAddComment) {
        await onAddComment(newComment.trim());
        setNewComment("");
        messageApi.success("Đã thêm bình luận!");
      }
    } catch {
      messageApi.error("Không thể thêm bình luận!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !replyingTo) {
      messageApi.warning("Vui lòng nhập nội dung trả lời!");
      return;
    }

    setLoading(true);
    try {
      // Ưu tiên sử dụng service trước, fallback về callback
      if (onCommentsUpdate) {
        await handleAddCommentService(replyContent.trim(), replyingTo);
        setReplyContent("");
        setReplyingTo(null);
      } else if (onAddComment) {
        await onAddComment(replyContent.trim(), replyingTo);
        setReplyContent("");
        setReplyingTo(null);
        messageApi.success("Đã thêm trả lời!");
      }
    } catch {
      messageApi.error("Không thể thêm trả lời!");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const handleShowMoreReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 1) + 4,
    }));
  };

  const handleShowLessReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: Math.max((prev[commentId] || 1) - 4, 1),
    }));
  };
  const handleAddCommentService = async (
    content: string,
    parentId?: string
  ) => {
    try {
      const res = await CommentService.createComment(documentId, {
        content,
        parentId: parentId || null,
      });
      if (res.success && onCommentsUpdate) {
        if (parentId) {
          // Nếu là reply, cập nhật parent comment's replies array
          const updatedComments = comments.map((comment) => {
            if (comment._id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), res.data],
                reply_count: (comment.reply_count || 0) + 1,
              };
            }
            return comment;
          });
          onCommentsUpdate(updatedComments);
        } else {
          // Nếu là comment mới, thêm vào đầu danh sách
          const updatedComments = [res.data, ...comments];
          onCommentsUpdate(updatedComments);
        }

        // Send notification to the document owner
        if (documentOwnerId) {
          await NotificationService.createCommentNotification(
            {
              _id: user?._id || "",
              first_name: user?.first_name || "",
              last_name: user?.last_name || "",
            },
            documentOwnerId,
            documentId
          );
        }

        // Send notification for replies
        if (parentId) {
          const parentComment = comments.find(
            (comment) => comment._id === parentId
          );
          if (parentComment && parentComment.user._id !== user?._id) {
            await NotificationService.createReplyNotification(
              {
                _id: user?._id || "",
                first_name: user?.first_name || "",
                last_name: user?.last_name || "",
              },
              parentComment.user._id,
              documentId,
              parentId
            );
          }
        }

        message.success(parentId ? "Đã thêm trả lời!" : "Đã thêm bình luận!");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      message.error("Không thể thêm bình luận!");
    }
  };

  return (
    <div className="py-6 border-b-gray-200 border-b">
      {contextHolder}
      {/* Header */}
      <h4 className="font-bold text-sm mb-4 text-[var(--secondary-text-color)]">
        Bình luận (
        {comments.length +
          comments.reduce(
            (acc, comment) => acc + (comment.reply_count || 0),
            0
          )}
        ):
      </h4>

      {/* Add New Comment */}
      <div className="mb-6">
        <TextArea
          placeholder="Hãy nêu cảm nhận của bạn về tài liệu này..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="mb-2"
          maxLength={1000}
          showCount
        />
        <div className="flex justify-end mt-4">
          <Button
            type="primary"
            style={{
              color: "white",
              backgroundColor: "var(--link-color)",
              padding: "0 15px",
            }}
            size="small"
            onClick={handleSubmitComment}
            loading={loading}
            disabled={!newComment.trim()}
          >
            Gửi
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {parentComments.length === 0 ? (
          <div className="text-center py-8 text-[var(--secondary-text-color)]">
            <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
          </div>
        ) : (
          parentComments.map((comment) => (
            <div key={comment._id}>
              {/* Parent Comment */}
              <CommentItem
                comment={comment}
                documentId={documentId}
                onReply={handleReply}
              />

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3">
                  {(() => {
                    const replies = comment.replies || [];
                    const visibleCount = expandedReplies[comment._id] || 1;
                    const visibleReplies = replies.slice(0, visibleCount);
                    const hasMore = replies.length > visibleCount;
                    const canCollapse = visibleCount > 1;

                    return (
                      <>
                        {visibleReplies.map((reply: Comment) => (
                          <CommentItem
                            key={reply._id}
                            comment={reply}
                            documentId={documentId}
                            isReply={true}
                          />
                        ))}

                        {(hasMore || canCollapse) && (
                          <div className="ml-12 mt-2 flex gap-2">
                            {hasMore && (
                              <Button
                                type="text"
                                size="small"
                                className="text-xs text-blue-500 hover:text-blue-700 p-0 h-auto"
                                onClick={() =>
                                  handleShowMoreReplies(comment._id)
                                }
                              >
                                Xem thêm{" "}
                                {Math.min(4, replies.length - visibleCount)} trả
                                lời
                              </Button>
                            )}
                            {canCollapse && (
                              <Button
                                type="text"
                                size="small"
                                className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto"
                                onClick={() =>
                                  handleShowLessReplies(comment._id)
                                }
                              >
                                Thu gọn
                              </Button>
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === comment._id && (
                <div className="ml-12 mt-3 p-3 bg-gray-50 rounded-lg">
                  <TextArea
                    placeholder={`Trả lời ${comment.user.first_name} ${comment.user.last_name}...`}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={2}
                    className="mb-2"
                    maxLength={1000}
                    showCount
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="small" onClick={handleCancelReply}>
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      icon={<SendOutlined />}
                      onClick={handleSubmitReply}
                      loading={loading}
                      disabled={!replyContent.trim()}
                    >
                      Trả lời
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;
