import { Heart, GraduationCap, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../../../contexts/UserContext";
import type { Document } from "../../../../models/document";
import { UserService } from "../../../../utils/UserService";
import { message } from "antd";

interface DocumentCardProps {
  document: Document;
  navigationPath?: string; // Optional custom navigation path
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

  // Sync with context
  useEffect(() => {
    if (document._id) {
      setIsFavorite(favoriteDocuments.some((doc) => doc._id === document._id));
    }
  }, [favoriteDocuments, document._id]);

  const handleCardClick = () => {
    if (disableClick) return;
    if (document._id && navigationPath) {
      navigate(navigationPath);
    } else if (document._id) {
      navigate(`/document-detail/${document._id}`);
    }
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        disableClick ? "cursor-not-allowed" : "hover:shadow-md cursor-pointer"
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
      {/* Nội dung dưới ảnh: dùng flex-col, justify-between để nút luôn ở dưới */}
      <div className="flex flex-col justify-between p-4 text-[var(--primary-text-color)]">
        <div>
          <h3 className="font-bold lg:text-xs mb-2 line-clamp-2 min-h-8">
            {document.title}
          </h3>
          {/* Tên người đăng */}
          <p className="text-xs mb-1 text-[var(--secondary-text-color)] truncate flex items-center gap-1">
            <User className="w-3 h-3" />
            {document.user?.first_name
              ? `${document.user.first_name} ${document.user.last_name || ""}`
              : "Người dùng ẩn danh"}
          </p>
          {/* Môn học */}
          <p className="text-xs mb-3 truncate flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            {document.subject?.name || "Chưa có môn học"}
          </p>
        </div>
        <button
          className="w-full  flex bg-white items-center justify-center gap-2 px-3 py-1 font-bold text-xs border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
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

export default DocumentCard;
