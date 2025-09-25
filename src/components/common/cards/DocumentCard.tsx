import React from "react";
import { Card, Tag, Button, Tooltip } from "antd";
import { Eye, Download, User, Calendar, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Document {
  _id: string;
  title: string;
  description?: string;
  cover_page?: string;
  author: string[];
  published_year?: number;
  doc_type: string;
  level: string;
  subject?: {
    name: string;
  };
  organization?: {
    name: string;
  };
  view_count?: number;
  download_count?: number;
  point?: number;
  createdAt: string;
  rating?: number;
}

interface DocumentCardProps {
  document: Document;
  showActions?: boolean;
  onRemove?: (documentId: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  showActions = true,
  onRemove,
}) => {
  const navigate = useNavigate();

  const handleViewDocument = () => {
    navigate(`/document-detail/${document._id}`);
  };

  const handleDownload = () => {
    // Implement download logic
    console.log("Download document:", document._id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <Card
      hoverable
      className="h-full shadow-sm"
      cover={
        <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
          {document.cover_page ? (
            <img
              src={document.cover_page}
              alt={document.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl text-blue-200 mb-2">📄</div>
              <div className="text-sm text-blue-400 font-medium">
                {document.doc_type}
              </div>
            </div>
          )}

          {/* Document type badge */}
          <div className="absolute top-2 left-2">
            <Tag color="blue" className="text-xs">
              {document.doc_type}
            </Tag>
          </div>

          {/* Rating */}
          {document.rating && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Star size={10} className="fill-current" />
              {document.rating.toFixed(1)}
            </div>
          )}
        </div>
      }
      actions={
        showActions
          ? [
              <Tooltip title="Xem chi tiết" key="view">
                <Button
                  type="text"
                  icon={<Eye size={16} />}
                  onClick={handleViewDocument}
                />
              </Tooltip>,
              <Tooltip title="Tải về" key="download">
                <Button
                  type="text"
                  icon={<Download size={16} />}
                  onClick={handleDownload}
                />
              </Tooltip>,
              onRemove && (
                <Tooltip title="Xóa khỏi yêu thích" key="remove">
                  <Button
                    type="text"
                    danger
                    onClick={() => onRemove(document._id)}
                  >
                    Xóa
                  </Button>
                </Tooltip>
              ),
            ].filter(Boolean)
          : []
      }
    >
      <Card.Meta
        title={
          <Tooltip title={document.title}>
            <div className="line-clamp-2 h-12 text-sm font-semibold">
              {document.title}
            </div>
          </Tooltip>
        }
        description={
          <div className="space-y-3">
            {/* Description */}
            {document.description && (
              <p className="text-gray-600 text-xs line-clamp-2">
                {document.description}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              <Tag color="green" className="text-xs">
                {document.level}
              </Tag>
              {document.subject && (
                <Tag color="purple" className="text-xs">
                  {document.subject.name}
                </Tag>
              )}
            </div>

            {/* Author and year */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              {document.author && document.author.length > 0 && (
                <span className="flex items-center gap-1">
                  <User size={10} />
                  <span className="truncate max-w-24">
                    {document.author.slice(0, 1).join(", ")}
                    {document.author.length > 1 && "..."}
                  </span>
                </span>
              )}

              {document.published_year && (
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {document.published_year}
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Eye size={10} />
                {document.view_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Download size={10} />
                {document.download_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {formatDate(document.createdAt)}
              </span>
            </div>

            {/* Organization */}
            {document.organization && (
              <div className="text-xs text-gray-400 truncate">
                {document.organization.name}
              </div>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default DocumentCard;
