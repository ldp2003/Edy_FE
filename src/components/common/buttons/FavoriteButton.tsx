import { Heart } from "lucide-react";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { message } from "antd";
import { UserService } from "../../../utils/UserService";

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
  const { favoriteDocuments, setFavoriteDocuments } = useContext(UserContext);
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with context when favoriteDocuments changes
  useEffect(() => {
    setIsFavorited(favoriteDocuments.some((doc) => doc._id === documentId));
  }, [favoriteDocuments, documentId]);

  const handleToggleFavorite = async () => {
    try {
      setIsLoading(true);
      if (isFavorited) {
        await UserService.removeFromFavorites(documentId);
        message.success("Đã bỏ khỏi danh sách yêu thích!");
        setFavoriteDocuments(
          favoriteDocuments.filter((doc) => doc._id !== documentId)
        );
      } else {
        const addedDoc = await UserService.addToFavorites(documentId);
        message.success("Đã thêm vào danh sách yêu thích!");
        // Nếu API trả về document mới, thêm vào danh sách
        if (addedDoc && addedDoc._id) {
          setFavoriteDocuments([...favoriteDocuments, addedDoc]);
        } else {
          // Nếu không trả về, fetch lại toàn bộ (fallback)
          // Không khuyến khích, nhưng để tránh lỗi
          // setFavoriteDocuments(await UserService.getListFavorites().documents || []);
        }
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
