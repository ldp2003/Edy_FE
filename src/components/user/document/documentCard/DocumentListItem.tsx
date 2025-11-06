import React from "react";
import { FileText, Heart, GraduationCap, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../../contexts/UserContext";
import type { Document } from "../../../../models/document";
import { UserService } from "../../../../utils/UserService";
import { message } from "antd";
import ViewCount from "../documentElement/ViewCount";
import PageCount from "../documentElement/PageCount";
import IntensiveMark from "../documentElement/IntensiveMark";

interface DocumentListItemProps {
  document: Document;
  onRemove?: (documentId: string) => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onRemove,
}) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { favoriteDocuments, setFavoriteDocuments } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (document._id) {
      setIsFavorite(favoriteDocuments.some((doc) => doc._id === document._id));
    }
  }, [favoriteDocuments, document._id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isFavorite) {
        await UserService.removeFromFavorites(document._id);
        setFavoriteDocuments((prev: Document[]) =>
          prev.filter((doc) => doc._id !== document._id)
        );
        messageApi.success("Đã xóa khỏi danh sách yêu thích");
        onRemove?.(document._id);
      } else {
        await UserService.addToFavorites(document._id);
        setFavoriteDocuments((prev: Document[]) => [...prev, document]);
        messageApi.success("Đã thêm vào danh sách yêu thích");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      messageApi.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  const handleItemClick = () => {
    navigate(`/document-detail/${document._id}`);
  };

  return (
    <div
      className="flex flex-col sm:flex-row text-left w-full gap-3 sm:gap-4 justify-between p-3 sm:p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleItemClick}
    >
      {contextHolder}
      <div className="flex items-start sm:items-center w-full sm:w-auto flex-1 min-w-0">
        <div className="icon bg-[var(--primary-color)] text-white p-2 rounded-full mr-3 sm:mr-4 flex-shrink-0">
          <FileText size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="item-title font-bold text-sm sm:text-base text-gray-800 break-words mb-1 sm:mb-2"
            title={document.title}
          >
            {document.title}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
            {document.view && (
              <span>
                <ViewCount count={document.view} />
              </span>
            )}
            {document.page && (
              <span>
                <PageCount pages={document.page} />
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-gray-500">
            {document.subject && (
              <div
                className="flex items-center gap-1"
                title={document.subject.name}
              >
                <GraduationCap className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{document.subject.name}</span>
              </div>
            )}
            {document.user && (
              <div
                className="flex items-center gap-1"
                title={`${document.user.first_name} ${document.user.last_name}`}
              >
                <User className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {document.user.first_name} {document.user.last_name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end sm:text-right flex-shrink-0 gap-2 sm:gap-1">
        <button
          onClick={handleFavoriteClick}
          className={`p-1.5 sm:p-2 rounded-full transition-colors ${
            isFavorite
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          }`}
        >
          <Heart
            className="w-3.5 h-3.5 sm:w-4 sm:h-4"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
        {document.intensive && (
          <div className="sm:mt-1">
            <IntensiveMark label="Chuyên sâu" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentListItem;
