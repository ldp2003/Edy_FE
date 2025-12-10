import React from "react";
import { FileText } from "lucide-react";
import DocumentCard from "../../../document/documentCard/DocumentCard";
import type { Document } from "../../../../../models/document";

interface OrganizationDocumentsProps {
  documents: Document[];
  displayedDocuments: Document[];
  displayedCount: number;
  totalDocuments: number;
  onLoadMore: () => void;
  title?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const OrganizationDocuments: React.FC<OrganizationDocumentsProps> = ({
  documents,
  displayedDocuments,
  displayedCount,
  totalDocuments,
  onLoadMore,
  title,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-[var(--primary-color)]" />
            <h2 className="text-base font-semibold text-[var(--primary-text-color)]">
              {title} ({totalDocuments})
            </h2>
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="text-sm text-[var(--secondary-text-color)] hover:text-[var(--primary-color)] transition-colors"
            >
              {isCollapsed ? "Mở rộng" : "Thu gọn"}
            </button>
          )}
        </div>

        {documents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
              {displayedDocuments.map((doc) => (
                <DocumentCard key={doc._id} document={doc} />
              ))}
            </div>

            {documents.length > displayedCount && (
              <div className="text-center mt-6">
                <button
                  className="text-[var(--primary-color)] hover:underline font-medium cursor-pointer"
                  onClick={onLoadMore}
                >
                  Xem thêm {documents.length - displayedCount} tài liệu khác
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-base font-semibold text-gray-600 mb-2">
              Chưa có tài liệu nào
            </h3>
            <p className="text-gray-500">
              Tổ chức này chưa có tài liệu được tải lên.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDocuments;
