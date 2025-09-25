import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Document } from "../../../../models/document";

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

  const handleCardClick = () => {
    if (document?._id) {
      navigate(`/document-detail/${document._id}`);
    }
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking save button
    // TODO: Implement save functionality
    console.log("Save document:", document?._id);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/public/image/thumb_1200_1553.png";
  };

  return (
    <div
      className="text-left  rounded-lg border border-gray-200 bg-[var(--card-background-color)] overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative flex justify-center items-center">
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
          <Heart className="w-3 h-3" />
          Lưu
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
