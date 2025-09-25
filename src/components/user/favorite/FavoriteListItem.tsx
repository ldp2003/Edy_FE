import React from "react";
import { Tag, Tooltip, Button } from "antd";
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
    target.src = "/public/image/thumb_1200_1553.png";
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
            src={document.cover_page || "/public/image/thumb_1200_1553.png"}
            alt={document.title}
            className="w-20 h-28 object-cover rounded-md"
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
            <Button
              danger
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(document._id);
              }}
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteListItem;
