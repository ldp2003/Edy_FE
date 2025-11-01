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
  maxDisplay = 5,
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
      <div className="bg-[var(--primary-background-color)] rounded-lg border border-[var(--border-color)] p-4 mb-4">
        <h2 className="text-lg font-semibold text-[var(--primary-text-color)] mb-4 text-center md:text-left">
          {title}
        </h2>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-[var(--primary-background-color)] rounded-lg border border-[var(--border-color)] p-4 mb-4">
        <h2 className="text-lg font-semibold text-[var(--primary-text-color)] mb-4 text-center md:text-left">
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
    <div className="bg-[var(--primary-background-color)] rounded-lg border border-[var(--border-color)] p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[var(--primary-text-color)] text-center md:text-left">
            {title}
          </h2>
          {canExpand && hasMoreDocuments && (
            <button
              className="text-sm text-[var(--primary-color)] hover:text-[var(--secondary-color)] font-medium"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded
                ? "Thu gọn"
                : `Xem thêm ${documents.length - maxDisplay} tài liệu`}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
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
