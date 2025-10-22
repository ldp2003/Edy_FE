/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import type { Document } from "../../../models/document";
import { UserService } from "../../../utils/UserService";
import { message } from "antd";

interface PersonalPostCardProps {
  document: Document;
  disableClick?: boolean;
}

const PersonalPostCard: React.FC<PersonalPostCardProps> = ({
  document,
  disableClick = false,
}) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { favoriteDocuments, setFavoriteDocuments } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sync with context
  useEffect(() => {
    if (document._id) {
      setIsFavorite(favoriteDocuments.some((doc) => doc._id === document._id));
    }
  }, [favoriteDocuments, document._id]);

  const isRejected = document.status === "REJECTED";
  const isRequestedEdit =
    document.status === "REQUESTED_EDIT" || document.status === "PENDING_EDIT";
  const hasRejectionMessage = document.content_rejection?.message;
  const showRejectionReason =
    (isRejected || isRequestedEdit) && hasRejectionMessage;

  const handleCardClick = () => {
    if (disableClick || isRejected) return;
    navigate(`/personal-posts/document-detail/${document._id}`);
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document._id || isRejected) return;

    try {
      if (isFavorite) {
        await UserService.removeFromFavorites(document._id);
        setFavoriteDocuments(
          favoriteDocuments.filter((doc) => doc._id !== document._id)
        );
        setIsFavorite(false);
        messageApi.success("Đã xóa tài liệu khỏi mục yêu thích!");
      } else {
        const addedDoc = await UserService.addToFavorites(document._id);
        if (addedDoc && addedDoc._id) {
          setFavoriteDocuments([...favoriteDocuments, addedDoc]);
        }
        setIsFavorite(true);
        messageApi.success("Đã lưu tài liệu vào mục yêu thích!");
      }
    } catch (error) {
      messageApi.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/public/image/default_cover.png";
  };

  return (
    <div
      className={`text-left rounded-lg border border-[var(--border-color)] overflow-hidden transition-shadow ${
        disableClick || isRejected
          ? "cursor-not-allowed opacity-60"
          : "hover:shadow-md cursor-pointer"
      }`}
      onClick={handleCardClick}
    >
      {contextHolder}
      <div className="bg-[var(--card-background-color)] rounded-md relative flex justify-center items-center">
        <img
          src={document.cover_page || "/public/image/default_cover.png"}
          alt={document.title}
          className="h-40 m-3 w-full object-fill rounded-md bg-white"
          onError={handleImageError}
        />
      </div>
      {/* Nội dung dưới ảnh */}
      <div className="flex flex-col justify-between p-4 text-[var(--primary-text-color)]">
        <div>
          <h3 className="font-bold lg:text-xs mb-2 line-clamp-2 min-h-8">
            {showRejectionReason ? (
              <div>
                <div
                  className={isRejected ? "line-through text-gray-400" : ""}
                  style={{ fontSize: "12px" }}
                >
                  {document.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: isRejected ? "#e74c3c" : "#f39c12",
                    fontStyle: "italic",
                    marginTop: "4px",
                  }}
                >
                  {isRejected ? "Lý do từ chối" : "Yêu cầu chỉnh sửa"}:{" "}
                  {document.content_rejection?.message}
                </div>
              </div>
            ) : (
              document.title
            )}
          </h3>
          <p className="text-xs mb-3 truncate">
            {document.view || 0} lượt xem • {document.comment_count || 0} bình
            luận
          </p>
        </div>
        <button
          className={`w-full flex bg-white items-center justify-center gap-2 px-3 py-1 font-bold text-xs border border-gray-300 rounded-md transition-colors ${
            isRejected
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-gray-50"
          }`}
          style={{ color: "var(--secondary-text-color)" }}
          onClick={handleSaveClick}
          disabled={isRejected}
        >
          <Heart
            className={`w-3 h-3 ${
              isFavorite ? "fill-red-500 text-red-500" : ""
            }`}
          />
          {isFavorite ? "Đã lưu" : "Lưu"}
        </button>
      </div>
    </div>
  );
};

export default PersonalPostCard;
