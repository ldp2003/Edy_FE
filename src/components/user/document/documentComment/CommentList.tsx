import React, { useState } from "react";
import { Button, Input, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import CommentItem from "./CommentItem";
import type { Comment } from "../../../../models/comment";

const { TextArea } = Input;

interface CommentListProps {
  comments: Comment[];
  onAddComment?: (content: string, parentId?: string) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, number>
  >({});

  // Nhóm comments theo parent
  const parentComments = comments.filter((comment) => !comment.parent);
  const repliesMap = comments.reduce((acc, comment) => {
    if (comment.parent) {
      const parentId =
        typeof comment.parent === "string"
          ? comment.parent
          : comment.parent._id;
      if (!acc[parentId]) acc[parentId] = [];
      acc[parentId].push(comment);
    }
    return acc;
  }, {} as Record<string, Comment[]>);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận!");
      return;
    }

    setLoading(true);
    try {
      if (onAddComment) {
        await onAddComment(newComment.trim());
        setNewComment("");
        message.success("Đã thêm bình luận!");
      }
    } catch {
      message.error("Không thể thêm bình luận!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !replyingTo) {
      message.warning("Vui lòng nhập nội dung trả lời!");
      return;
    }

    setLoading(true);
    try {
      if (onAddComment) {
        await onAddComment(replyContent.trim(), replyingTo);
        setReplyContent("");
        setReplyingTo(null);
        message.success("Đã thêm trả lời!");
      }
    } catch {
      message.error("Không thể thêm trả lời!");
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

  return (
    <div className="py-6 border-b-gray-200 border-b">
      {/* Header */}
      <h4 className="font-bold text-sm mb-4 text-[var(--secondary-text-color)]">
        Bình luận ({comments.length}):
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
              <CommentItem comment={comment} onReply={handleReply} />

              {/* Replies */}
              {repliesMap[comment._id] && (
                <div className="mt-3">
                  {(() => {
                    const replies = repliesMap[comment._id];
                    const visibleCount = expandedReplies[comment._id] || 1;
                    const visibleReplies = replies.slice(0, visibleCount);
                    const hasMore = replies.length > visibleCount;
                    const canCollapse = visibleCount > 1;

                    return (
                      <>
                        {visibleReplies.map((reply) => (
                          <CommentItem
                            key={reply._id}
                            comment={reply}
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
