import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Document } from "../../../../models/document";
import { UserService } from "../../../../utils/UserService";
import { message } from "antd";

interface DocumentCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  document?: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  description,
  imageUrl,
  document,
}) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isFavorite, setIsFavorite] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [favoriteDocuments, setFavoriteDocuments] = useState<string[]>([]);

  // Check if document is in favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoritesResponse = await UserService.getListFavorites();
        const favoriteIds =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          favoritesResponse.documents?.map((doc: any) => doc._id) || [];
        setFavoriteDocuments(favoriteIds);

        if (document?._id) {
          setIsFavorite(favoriteIds.includes(document._id));
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      }
    };

    fetchFavorites();
  }, [document?._id]);

  const handleCardClick = () => {
    if (document?._id) {
      navigate(`/document-detail/${document._id}`);
    }
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking save button
    if (!document?._id) return;

    try {
      if (isFavorite) {
        await UserService.removeFromFavorites(document._id);
        setIsFavorite(false);
        messageApi.success("Đã xóa tài liệu khỏi mục yêu thích!");
      } else {
        await UserService.addToFavorites(document._id);
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
    target.src = "/public/image/thumb_1200_1553.png";
  };

  return (
    <div
      className="text-left  rounded-lg border border-[var(--border-color)]  overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {contextHolder}
      <div className="bg-[var(--card-background-color)] rounded-md relative flex justify-center items-center">
        <img
          src={imageUrl || "/public/image/thumb_1200_1553.png"}
          alt={title}
          className="h-40 m-3 w-full object-fill rounded-md"
          onError={handleImageError}
        />
      </div>
      {/* Nội dung dưới ảnh: dùng flex-col, justify-between để nút luôn ở dưới */}
      <div className="flex flex-col justify-between p-4 text-[var(--primary-text-color)]">
        <div>
          <h3 className="font-bold lg:text-xs mb-2 line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>
          <p className="text-xs mb-3">{description}</p>
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

export default DocumentCard;
