import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Document } from "../../../models/document";
import { UserService } from "../../../utils/UserService";

interface FavoriteCardProps {
  document: Document;
  onRemove?: (documentId: string) => void;
  isFavorite?: boolean;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ document, onRemove }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if document is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favoritesResponse = await UserService.getListFavorites();
        const favoriteIds =
          favoritesResponse.documents?.map((doc: Document) => doc._id) || [];
        setIsFavorite(favoriteIds.includes(document._id));
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    checkFavoriteStatus();
  }, [document._id]);

  const handleCardClick = () => {
    navigate(`/document-detail/${document._id}`);
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (isFavorite) {
        await UserService.removeFromFavorites(document._id);
        setIsFavorite(false);
        if (onRemove) {
          onRemove(document._id);
        }
      } else {
        await UserService.addToFavorites(document._id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/public/image/thumb_1200_1553.png";
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image with heart icon */}
      <div className="relative">
        <img
          src={document.cover_page || "/public/image/thumb_1200_1553.png"}
          alt={document.title}
          className="h-40 w-full object-cover"
          onError={handleImageError}
        />

        {/* Heart icon */}
        <div
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          onClick={handleHeartClick}
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isFavorite
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
              <span className="font-medium">Môn:</span> {document.subject.name}
            </div>
          )}

          {document.organization && (
            <div className="text-xs text-gray-600 truncate">
              <span className="font-medium">Trường:</span>{" "}
              {document.organization.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteCard;
