import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { ReadHistoryItem as ReadHistoryItemType } from "../../../contexts/UserContext";

interface ReadHistoryItemProps {
  item: ReadHistoryItemType;
  onClick: (documentId: string) => void;
}

const ReadHistoryItem: React.FC<ReadHistoryItemProps> = ({ item, onClick }) => {
  const handleClick = () => {
    onClick(item.document._id);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/public/image/default_cover.png";
  };

  const getFileTypeStyle = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return "text-red-600 bg-red-50";
      case "WORD":
        return "text-blue-600 bg-blue-50";
      case "EXCEL":
        return "text-green-600 bg-green-50";
      case "POWERPOINT":
        return "text-orange-600 bg-orange-50";
      case "VIDEO":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-[var(--secondary-text-color)] bg-[var(--third-background-color)]";
    }
  };

  return (
    <div
      className="flex items-start p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
      onClick={handleClick}
    >
      <img
        src={item.document.cover_page}
        alt={item.document.title}
        onError={handleImageError}
        className="w-16 h-16 object-cover rounded-lg bg-white border border-gray-200 flex-shrink-0"
      />

      <div className="flex-1 ml-3 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div className="font-medium text-[var(--primary-text-color)] hover:text-[var(--primary-color)] text-sm truncate pr-2">
            {item.document.title}
          </div>
          <div className="text-xs text-[var(--secondary-text-color)] flex-shrink-0">
            {format(new Date(item.read_at), "dd/MM/yyyy HH:mm", { locale: vi })}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {item.document.subject && (
            <span className="text-[var(--link-color)] bg-[var(--field-background-color)] px-2 py-1 rounded">
              {item.document.subject.name}
            </span>
          )}

          {item.document.file_type && (
            <span
              className={`px-2 py-1 rounded font-medium ${getFileTypeStyle(
                item.document.file_type
              )}`}
            >
              {item.document.file_type}
            </span>
          )}

          {item.document.user && (
            <span className="font-medium  px-2 py-1 text-[var(--third-text-color)]">
              {item.document.user.first_name} {item.document.user.last_name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadHistoryItem;
