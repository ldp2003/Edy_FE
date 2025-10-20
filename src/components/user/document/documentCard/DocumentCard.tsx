import { Heart, GraduationCap, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../../contexts/UserContext";
import type { Document } from "../../../../models/document";
import { UserService } from "../../../../utils/UserService";
import { message } from "antd";

interface DocumentCardProps {
  document: Document;
  navigationPath?: string;
  disableClick?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  navigationPath,
  disableClick = false,
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

  const handleCardClick = () => {
    if (!disableClick) {
      navigate(navigationPath || `/document-detail/${document._id}`);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-200 w-[160px] md:w-full flex-shrink-0"
      onClick={handleCardClick}
    >
      {contextHolder}
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={document.cover_page || "/image/default_cover.png"}
          alt={document.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-1.5 rounded-full ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-600 hover:bg-white"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-2 md:p-3">
        <h3 className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 mb-1">
          {document.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-600 text-[10px] md:text-xs">
          {document.subject ? (
            <GraduationCap className="w-3 h-3 flex-shrink-0" />
          ) : (
            <User className="w-3 h-3 flex-shrink-0" />
          )}
          <span className="truncate">
            {document.subject?.name || document.user?.first_name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
