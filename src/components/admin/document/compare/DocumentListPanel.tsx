import React from "react";
import DocumentList from "./DocumentList";
import type { Document } from "../../../../models/document";

interface DocumentListPanelProps {
  onSelectDocument: (document: Document) => void;
  selectedDocumentId?: string;
}

const DocumentListPanel: React.FC<DocumentListPanelProps> = ({
  onSelectDocument,
  selectedDocumentId,
}) => {
  return (
    <div className="bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <h2 className="text-base font-medium text-[var(--primary-text-color)]">
          Danh sách tài liệu
        </h2>
        <p className="text-xs text-gray-600 mt-1">Chọn tài liệu để so sánh</p>
      </div>
      <div className="flex-1 overflow-auto">
        <DocumentList
          onSelectDocument={onSelectDocument}
          selectedDocumentId={selectedDocumentId}
        />
      </div>
    </div>
  );
};

export default DocumentListPanel;
