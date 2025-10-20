import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { Tooltip } from "antd";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Document } from "../../../models/document";

interface FavoriteCardProps {
  document: Document;
  onRemove?: (documentId: string) => void;
  isFavorite?: boolean;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ document, onRemove }) => {
  const navigate = useNavigate();
  const { favoriteDocuments } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);

  // Sync with context
  useEffect(() => {
    setIsFavorite(favoriteDocuments.some((doc) => doc._id === document._id));
  }, [favoriteDocuments, document._id]);

  const handleCardClick = () => {
    navigate(`/document-detail/${document._id}`);
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Chỉ gọi callback từ parent component để xử lý
    if (onRemove) {
      onRemove(document._id);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/public/image/default_cover.png";
  };

  return (
    <div
      className="bg-white text-left rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={document.has_access ? handleCardClick : undefined}
    >
      {/* Image with heart icon */}
      {/* Nếu document không có quyền truy cập thì disabled */}
      <div className={!document.has_access ? "cursor-not-allowed" : ""} >
        <div className="relative bg-[var(--card-background-color)] flex justify-center items-center py-2">
          <img
            src={document.cover_page || "/public/image/default_cover.png"}
            alt={document.title}
            className="w-[90%] bg-white object-fill h-32 shadow-sm rounded-lg"
            onError={handleImageError}
          />

          {/* Heart icon */}
          <div
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            onClick={handleHeartClick}
          >
            <Heart
              size={16}
              className={`transition-colors ${isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-400 hover:text-red-500"
                }`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <Tooltip title={document.title}>
            <h3 className="font-semibold text-sm line-clamp-2 h-10 mb-3">
              {document.title}
            </h3>
          </Tooltip>

          {/* Subject and Organization */}
          <div className="space-y-2">
            {document.subject && (
              <div className="text-xs text-gray-600">
                <span className="font-medium"></span> {document.subject.name}
              </div>
            )}

            {document.organization && (
              <div className="text-xs text-[var(--primary-color)] truncate">
                <span className="font-medium"></span> {document.organization.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
