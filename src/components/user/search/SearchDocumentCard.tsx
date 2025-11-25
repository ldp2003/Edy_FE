/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Heart } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import type { Document } from "../../../models/document";
import { UserService } from "../../../utils/UserService";
import { message } from "antd";

interface SearchDocumentCardProps {
  document: Document;
}

const SearchDocumentCard: React.FC<SearchDocumentCardProps> = ({
  document,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { favoriteDocuments, setFavoriteDocuments } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sync with context
  useEffect(() => {
    const isFav = document._id
      ? favoriteDocuments.some((doc) => doc._id === document._id)
      : false;
    if (isFav !== isFavorite) {
      setIsFavorite(isFav);
    }
  }, [document._id, favoriteDocuments, isFavorite]);

  const handleCardClick = () => {
    window.location.href = `/documents/${document._id}`;
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!document._id) return;

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
      className="text-left rounded-lg border border-[var(--border-color)] overflow-hidden transition-shadow hover:shadow-md cursor-pointer"
      onClick={handleCardClick}
    >
      {contextHolder}
      <div className="bg-[var(--card-background-color)] rounded-md relative flex justify-center items-center">
        <img
          src={document.cover_page || "/public/image/default_cover.png"}
          alt={document.title}
          className="h-40 m-3 w-full object-fill rounded-md bg-[var(--primary-background-color)]"
          onError={handleImageError}
        />
      </div>
      {/* Nội dung dưới ảnh */}
      <div className="flex flex-col justify-between p-4 text-[var(--primary-text-color)]">
        <div>
          <h3 className="font-bold lg:text-xs mb-2 line-clamp-2 min-h-8">
            {document.title}
          </h3>
          <p className="text-xs mb-3 truncate text-[var(--secondary-text-color)]">
            {document.page || 0} trang • {document.view || 0} lượt xem •{" "}
            {document.download_count || 0} lượt tải
          </p>
        </div>
        <button
          className="w-full flex bg-[var(--primary-background-color)] items-center justify-center gap-2 px-3 py-1 font-bold text-xs border border-[var(--border-color)] rounded-md cursor-pointer hover:bg-[var(--secondary-background-color)] transition-colors"
          style={{ color: "var(--secondary-text-color)" }}
          onClick={handleSaveClick}
        >
          <Heart
            className={`w-3 h-3 ${
              isFavorite
                ? "fill-[var(--red-button-color)] text-[var(--red-button-color)]"
                : ""
            }`}
          />
          {isFavorite ? "Đã lưu" : "Lưu"}
        </button>
      </div>
    </div>
  );
};

export default SearchDocumentCard;
