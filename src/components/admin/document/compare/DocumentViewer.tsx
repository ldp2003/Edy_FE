import React from "react";
import { Button } from "antd";
import SecurePdfViewer from "./SecurePdfViewer";
import type { Document } from "../../../../models/document";

interface DocumentViewerProps {
  document: Document | null;
  title: string;
  subtitle?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  title,
  subtitle,
}) => {
  const renderDocumentContent = () => {
    if (!document) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p>{subtitle || "Chưa chọn tài liệu"}</p>
          </div>
        </div>
      );
    }

    if (!document.url) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <p className="text-gray-600">Không có file để hiển thị</p>
        </div>
      );
    }

    // Render based on file type
    switch (document.file_type) {
      case "PDF":
        return <SecurePdfViewer url={document.url} />;

      case "WORD":
        return (
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(
              document.url
            )}&embedded=true`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
            title={`${title} Viewer`}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-center p-4">
              <p className="text-gray-600 mb-4">Không thể xem trước file này</p>
              <Button
                type="primary"
                onClick={() => window.open(document.url, "_blank")}
              >
                Mở file trong tab mới
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <h2 className="text-base font-medium text-[var(--primary-text-color)]">
          {title}
        </h2>
        <p className="text-xs text-gray-600 mt-1 truncate">
          {document
            ? document.title
            : subtitle || "Chưa chọn tài liệu để so sánh"}
        </p>
      </div>
      <div className="flex-1 overflow-auto">{renderDocumentContent()}</div>
    </div>
  );
};

export default DocumentViewer;
