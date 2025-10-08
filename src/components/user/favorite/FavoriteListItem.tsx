import React from "react";
import { Tag, Tooltip } from "antd";
import { Eye, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Document } from "../../../models/document";

interface FavoriteListItemProps {
  document: Document;
  onRemove: (documentId: string) => void;
}

const FavoriteListItem: React.FC<FavoriteListItemProps> = ({
  document,
  onRemove,
}) => {
  const navigate = useNavigate();

  const handleDocumentClick = () => {
    navigate(`/document-detail/${document._id}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/public/image/default_cover.png";
  };

  return (
    <div
      className="mb-4 cursor-pointer hover:shadow-md transition-shadow bg-white border border-gray-200 rounded-lg p-2"
      onClick={handleDocumentClick}
    >
      <div className="flex text-left items-center space-x-4">
        {/* Document Image */}
        <div className="flex-shrink-0 bg-[var(--card-background-color)] p-2 rounded-md">
          <img
            src={document.cover_page || "/public/image/default_cover.png"}
            alt={document.title}
            className="w-20 h-28 object-fill rounded-md bg-white"
            onError={handleImageError}
          />
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Tooltip title={document.title}>
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2">
                  {document.title}
                </h3>
              </Tooltip>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {document.doc_type && (
                  <Tag color="blue" className="text-xs">
                    {document.doc_type}
                  </Tag>
                )}
                {document.level && (
                  <Tag color="green" className="text-xs">
                    {document.level}
                  </Tag>
                )}
                {document.subject && (
                  <Tag color="purple" className="text-xs">
                    {document.subject.name}
                  </Tag>
                )}
              </div>

              {/* Meta Information */}
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {document.author && document.author.length > 0 && (
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {document.author.slice(0, 2).join(", ")}
                    {document.author.length > 2 && "..."}
                  </span>
                )}

                {document.published_year && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {document.published_year}
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {document.view || 0} lượt xem
                </span>
              </div>

              {/* Organization */}
              {document.organization && (
                <div className="mt-2 text-xs text-gray-400">
                  {document.organization.name}
                </div>
              )}
            </div>

            {/* Remove Button */}
            <div
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(document._id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                fill="red"
                viewBox="0 0 24 24"
                className="transition-colors"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteListItem;
