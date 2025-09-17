import { Heart } from "lucide-react";

interface DocumentCardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <div
      className="text-left rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      style={{ backgroundColor: "var(--card-background-color)" }}
    >
      <div className="relative flex justify-center items-center">
        <img
          src={imageUrl || "/public/image/thumb_1200_1553.png"}
          alt={title}
          className=" h-28 m-3 w-full object-cover"
        />
      </div>
      <div className="p-4" style={{ color: "var(--primary-text-color)" }}>
        <h3 className="font-bold  lg:text-sm mb-2 line-clamp-2">{title}</h3>
        <p className="text-xs mb-3 line-clamp-2">{description}</p>
        <button className="w-full flex bg-white items-center justify-center gap-2 px-3 py-1 font-bold text-xs border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
        style={{ color: "var(--secondary-text-color)" }}>
          <Heart className="w-3 h-3" />
          Lưu
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
