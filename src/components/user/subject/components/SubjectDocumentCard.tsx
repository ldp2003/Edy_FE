/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../../contexts/UserContext";
import type { Document } from "../../../../models/document";
import { UserService } from "../../../../utils/UserService";
import { message } from "antd";
import {
  getDocumentTypeFromFileName,
  documentTypeLabels,
  DocumentType,
} from "../../../../models/document";

interface SubjectDocumentCardProps {
  document: Document;
}

const SubjectDocumentCard: React.FC<SubjectDocumentCardProps> = ({
  document,
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

  const handleCardClick = () => {
    navigate(`/document-detail/${document._id}`);
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

  // Use doc_type from API or determine from filename as fallback
  const docType =
    document.doc_type || getDocumentTypeFromFileName(document.title);
  const typeLabel =
    documentTypeLabels[docType as keyof typeof DocumentType] || docType;

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
          className="h-40 m-3 w-full object-fill rounded-md bg-white"
          onError={handleImageError}
        />
      </div>
      {/* Nội dung dưới ảnh */}
      <div className="flex flex-col justify-between p-4 text-[var(--primary-text-color)]">
        <div>
          <h3 className="font-bold lg:text-xs mb-2 line-clamp-2 min-h-8">
            {document.title}
          </h3>
          <p className="text-xs mb-3 truncate">
            {document.user?.first_name} {document.user?.last_name} •{" "}
            {document.published_year ||
              new Date(document.createdAt).getFullYear()}{" "}
            • {typeLabel}
          </p>
        </div>
        <button
          className="w-full flex bg-white items-center justify-center gap-2 px-3 py-1 font-bold text-xs border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ color: "var(--secondary-text-color)" }}
          onClick={handleSaveClick}
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

export default SubjectDocumentCard;
