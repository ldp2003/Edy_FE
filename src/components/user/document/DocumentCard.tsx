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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[3/4] bg-gray-100 relative">
        <img
          src={
            imageUrl ||
            "/placeholder.svg?height=300&width=225&query=document preview"
          }
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{title}</h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{description}</p>
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-transparent hover:bg-gray-50 transition-colors">
          <Heart className="w-3 h-3" />
          Lưu
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
