import { Heart, GraduationCap, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../../contexts/UserContext";
import type { Document } from "../../../../models/document";
import { UserService } from "../../../../utils/UserService";
import { message } from "antd";
import FileType from "../documentElement/FileType";

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/image/default_cover.png";
  };

  return (
    <div
      className="bg-white text-center md:text-left rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer transform transition-all duration-200 hover:shadow-xl hover:-translate-y-1 w-full max-w-[160px] md:max-w-[180px] flex-shrink-0 flex flex-col"
      onClick={handleCardClick}
    >
      {contextHolder}
      {/* Cover Image */}
      <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
        <img
          src={document.cover_page || "/image/default_cover.png"}
          alt={document.title}
          className="w-full h-full object-contain bg-[var(--secondary-background-color)] transform transition-transform duration-200 hover:scale-[1.05]"
          loading="lazy"
          onError={handleImageError}
        />
        {/* Badge Chuyên sâu */}
        {document.intensive && (
          <div className="absolute top-0 left-0 px-2 py-0.5 text-[9px] font-bold rounded-br-lg bg-white/95 text-[var(--intensive-color)] border-r border-b border-[var(--intensive-color)]">
            Chuyên sâu
          </div>
        )}
        {/* File Type Badge */}
        {document.file_type && (
          <div className="absolute bottom-0 left-0">
            <FileType fileType={document.file_type} rounded={false} />
          </div>
        )}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 p-1.5 rounded-full cursor-pointer ${
            isFavorite
              ? "bg-[var(--color-error-bg)] text-[var(--heart-color)]"
              : "bg-[var(--secondary-background-color)]/80 text-[var(--secondary-text-color)] hover:bg-[var(--secondary-background-color)]"
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isFavorite ? "fill-[var(--heart-color)]" : ""
            }`}
          />
        </button>
        {/* Số trang */}
        {document.page && (
          <div className="absolute bottom-0 right-0 bg-white text-[var(--primary-text-color)] text-xs px-2 py-1 rounded-t-lg flex items-center gap-1">
            <FileText className="w-3 h-3" />
            <span>{document.page}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 md:p-3 flex flex-col flex-1">
        <h3
          className="text-xs md:text-sm font-medium text-[var(--primary-text-color)]
         line-clamp-2 break-words break-all min-h-[32px] md:min-h-[40px] mb-2"
        >
          {document.title}
        </h3>

        <div className="space-y-1 mt-auto">
          {/* Môn học */}
          <div className="flex items-center gap-1 text-[var(--secondary-text-color)] text-[10px] md:text-xs h-[16px] md:h-[18px]">
            {document.subject ? (
              <>
                <GraduationCap className="w-3 h-3 flex-shrink-0" />
                <span className="truncate" title={document.subject.name}>
                  {document.subject.name}
                </span>
              </>
            ) : (
              <span className="opacity-0">Placeholder</span>
            )}
          </div>
          {/* Người đăng */}
          <div className="flex items-center gap-1 text-[var(--secondary-text-color)] text-[10px] md:text-xs h-[16px] md:h-[18px]">
            {document.user ? (
              <>
                <User className="w-3 h-3 flex-shrink-0" />
                <span
                  className="truncate"
                  title={`${document.user.first_name} ${document.user.last_name}`}
                >
                  {document.user.first_name} {document.user.last_name}
                </span>
              </>
            ) : (
              <span className="opacity-0">Placeholder</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
