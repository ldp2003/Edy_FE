import React, { useState, useEffect } from "react";
import { Download, Heart, ThumbsUp, ThumbsDown, User } from "lucide-react";
import { message } from "antd";
import type { Document } from "../../../../models/document";
import AuthorInfo from "../../../common/userInfo/AuthorInfo";
import { UserContext } from "../../../../contexts/UserContext";
import { DocumentService } from "../../../../utils/DocumentService";
import { NotificationService } from "../../../../utils/NotificationService";

interface DocumentDetailActionsProps {
  document: Document;
}

const DocumentDetailActions: React.FC<DocumentDetailActionsProps> = ({
  document,
}) => {
  const [showAuthorInfo, setShowAuthorInfo] = useState(false);
  const { user } = React.useContext(UserContext);
  const [userReaction, setUserReaction] = useState<"LIKE" | "DISLIKE" | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Fetch initial reaction data
  useEffect(() => {
    const fetchReaction = async () => {
      if (!user) return;
      try {
        const response = await DocumentService.getDocumentReactions(
          document._id
        );
        setUserReaction(response.reacted === "NONE" ? null : response.reacted);
      } catch (error) {
        console.error("Error fetching reaction:", error);
      }
    };
    fetchReaction();
  }, [document._id, user]);

  const handleReaction = async (reaction: "LIKE" | "DISLIKE") => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để thực hiện hành động này!");
      return;
    }
    try {
      setLoading(true);
      let newReaction: "LIKE" | "DISLIKE" | "UNREACT";

      if (userReaction === reaction) {
        newReaction = "UNREACT";
      } else {
        newReaction = reaction;
      }

      await DocumentService.reactDocument(document._id, newReaction);

      if (newReaction === "UNREACT") {
        setUserReaction(null);
        message.success("Đã bỏ phản hồi!");
      } else {
        setUserReaction(newReaction);
        message.success(
          newReaction === "LIKE"
            ? "Đã thích tài liệu!"
            : "Đã không thích tài liệu!"
        );

        // Tạo thông báo cho chủ tài liệu nếu không phải là người dùng hiện tại
        if (user && user._id !== document.user._id) {
          try {
            await NotificationService.createReactionNotification(
              {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
              },
              document.user._id,
              document._id,
              document.title,
              newReaction
            );
          } catch (error) {
            console.error("Error creating reaction notification:", error);
            // Không hiển thị lỗi cho user vì đây là tính năng phụ
          }
        }
      }
    } catch (error) {
      console.error("Error reacting to document:", error);
      message.error("Không thể thực hiện hành động này!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 z-20">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Nút tải xuống */}
        <button className="px-4 py-2 bg-[var(--green-button-color)] text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90">
          <Download size={16} />
          <span>Tải xuống</span>
        </button>

        <div className="flex items-center gap-4">
          {/* Nút yêu thích */}
          <button className="text-[var(--primary-text-color)] hover:text-[var(--primary-color)]/80">
            <Heart size={24} />
          </button>

          {/* Nút xem thông tin người đăng */}
          <button
            onClick={() => setShowAuthorInfo(!showAuthorInfo)}
            className="text-[var(--primary-text-color)] hover:text-[var(--primary-color)]/80"
          >
            <User size={24} />
          </button>
        </div>
      </div>

      {/* Panel thông tin người đăng - hiển thị như phần mở rộng của header */}
      {showAuthorInfo && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 animate-in slide-in-from-top">
          <div className="max-w-screen-xl mx-auto">
            <AuthorInfo document={document} />
            <div className="flex items-center justify-center gap-8 mt-4">
              <button
                onClick={() => handleReaction("LIKE")}
                disabled={loading}
                className={`flex items-center gap-2 ${
                  userReaction === "LIKE"
                    ? "text-[var(--green-button-color)]"
                    : "text-[var(--primary-color)]"
                } ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
                }`}
              >
                <ThumbsUp size={20} />
                <span className="text-sm">Thích</span>
              </button>
              <button
                onClick={() => handleReaction("DISLIKE")}
                disabled={loading}
                className={`flex items-center gap-2 ${
                  userReaction === "DISLIKE"
                    ? "text-[var(--red-button-color)]"
                    : "text-[var(--primary-color)]"
                } ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"
                }`}
              >
                <ThumbsDown size={20} />
                <span className="text-sm">Không thích</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentDetailActions;
