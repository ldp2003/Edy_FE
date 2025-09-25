import { Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { message } from "antd";
import { UserService } from "../../../utils/UserService";
import type { Document } from "../../../models/document";

interface FavoriteButtonProps {
  documentId: string;
  initialFavorited?: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  documentId,
  initialFavorited = false,
  onToggle,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  // Check if document is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favoritesResponse = await UserService.getListFavorites();
        const favoriteIds =
          favoritesResponse.documents?.map((doc: Document) => doc._id) || [];
        const isFav = favoriteIds.includes(documentId);
        setIsFavorited(isFav);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    if (!initialFavorited) {
      checkFavoriteStatus();
    }
  }, [documentId, initialFavorited]);

  const handleToggleFavorite = async () => {
    try {
      setIsLoading(true);

      if (isFavorited) {
        await UserService.removeFromFavorites(documentId);
        message.success("Đã bỏ khỏi danh sách yêu thích!");
      } else {
        await UserService.addToFavorites(documentId);
        message.success("Đã thêm vào danh sách yêu thích!");
      }

      const newFavoritedState = !isFavorited;
      setIsFavorited(newFavoritedState);
      onToggle?.(newFavoritedState);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`text-xs flex items-center space-x-2 rounded-2xl border px-3 py-1 font-semibold cursor-pointer transition-colors duration-300 ${
          isFavorited
            ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
            : "bg-white border-gray-300 text-[var(--favorite-color)] hover:bg-[#ffb800] hover:text-white"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <Heart size={15} className={isFavorited ? "fill-current" : ""} />
        <span className="text-xs">{isFavorited ? "Đã lưu" : "Lưu"}</span>
      </button>
    </div>
  );
};

export default FavoriteButton;
