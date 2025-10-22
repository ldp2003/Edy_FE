import React from "react";
import { Empty, Pagination } from "antd";
import DocumentCard from "../../document/documentCard/DocumentCard";
import type { Document } from "../../../../models/document";

interface DocumentSectionProps {
  title: string;
  documents: Document[];
  loading?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalDocuments?: number;
  totalPages?: number;
  pageSize?: number;
  searchTerm?: string;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  maxDisplay?: number; // Số tài liệu hiển thị ban đầu
  canExpand?: boolean; // Có thể mở rộng không
}

const DocumentSection: React.FC<DocumentSectionProps> = ({
  title,
  documents,
  loading = false,
  showPagination = false,
  currentPage = 1,
  totalDocuments = 0,
  totalPages = 0,
  pageSize = 12,
  searchTerm = "",
  onPageChange,
  emptyMessage,
  maxDisplay = 4,
  canExpand = true,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Tính toán tài liệu hiển thị
  const displayDocuments = isExpanded
    ? documents
    : documents.slice(0, maxDisplay);
  const hasMoreDocuments = documents.length > maxDisplay;
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center md:text-left">
          {title}
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center md:text-left">
          {title}
        </h2>
        <Empty
          description={
            emptyMessage ||
            (searchTerm
              ? `Không tìm thấy tài liệu nào với từ khóa "${searchTerm}"`
              : "Chưa có tài liệu nào trong danh mục này")
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 text-center md:text-left">
            {title}
          </h2>
          {canExpand && hasMoreDocuments && (
            <button
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded
                ? "Thu gọn"
                : `Xem thêm ${documents.length - maxDisplay} tài liệu`}
            </button>
          )}
        </div>
        <span className="text-sm text-gray-600">
          Hiển thị {displayDocuments.length} / {documents.length} tài liệu
          {searchTerm && (
            <span className="font-medium"> cho "{searchTerm}"</span>
          )}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {displayDocuments.map((doc) => {
          return <DocumentCard key={doc._id} document={doc} />;
        })}
      </div>

      {showPagination && totalPages > 1 && onPageChange && (
        <div className="flex justify-center">
          <Pagination
            current={currentPage}
            total={totalDocuments}
            pageSize={pageSize}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} tài liệu`
            }
            showSizeChanger={false}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentSection;
