import React from "react";

import WordViewer from "./WordViewer";
import PDFViewer from "./PDFViewer";
import ExcelViewer from "./ExcelViewer";
import PowerPointViewer from "./PowerPointViewer";
import VideoViewer from "./VideoViewer";

interface DocumentViewerProps {
  url: string;
  type: "pdf" | "ppt" | "excel" | "video" | "word";
  onPageChange?: (currentPage: number, totalPages: number) => void;
  currentPage?: number;
  onPageUpdate?: (page: number) => void;
  zoom?: number;
  isUser?: boolean; // True if document belongs to current user (no limitations)
  documentId?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  url,
  type,
  onPageChange,
  currentPage,
  onPageUpdate,
  zoom,
  isUser = false,
  documentId,
}) => {
  const renderViewer = () => {
    if (type === "pdf") {
      return (
        <PDFViewer
          url={url}
          onPageChange={onPageChange}
          currentPage={currentPage}
          onPageUpdate={onPageUpdate}
          zoom={zoom}
          isUser={isUser}
          documentId={documentId}
        />
      );
    }
    if (type === "word") {
      return (
        <WordViewer
          url={url}
          zoom={zoom}
          isUser={isUser}
          documentId={documentId}
        />
      );
    }
    if (type === "ppt") {
      return <PowerPointViewer url={url} zoom={zoom} isUser={isUser} />;
    }
    if (type === "excel") {
      return <ExcelViewer url={url} zoom={zoom} isUser={isUser} />;
    }
    if (type === "video") {
      return <VideoViewer url={url} isUser={isUser} documentId={documentId} />;
    }
    return (
      <div className="text-center py-10 px-4 text-sm sm:text-base text-gray-600">
        Unsupported document type
      </div>
    );
  };

  return (
    <div className="w-full relative overflow-hidden document-viewer-container">
      {renderViewer()}
    </div>
  );
};

export default DocumentViewer;
