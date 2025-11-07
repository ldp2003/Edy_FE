import React from "react";

import WordViewer from "./WordViewer";
import PDFViewer from "./PDFViewer";
import ExcelViewer from "./ExcelViewer";
import PowerPointViewer from "./PowerPointViewer";
import VideoViewer from "./VideoViewer";
import DocumentPagination from "./DocumentPagination";

interface DocumentViewerProps {
  url: string;
  type: "pdf" | "ppt" | "excel" | "video" | "word";
  onPageChange?: (currentPage: number, totalPages: number) => void;
  currentPage?: number;
  onPageUpdate?: (page: number) => void;
  zoom?: number;
  isUser?: boolean; // True if document belongs to current user (no limitations)
  // Pagination props
  totalPages?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onGoToPage?: (page: number) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  url,
  type,
  onPageChange,
  currentPage,
  onPageUpdate,
  zoom,
  isUser = false,
  totalPages,
  onPrevPage,
  onNextPage,
  onGoToPage,
  onZoomIn,
  onZoomOut,
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
        />
      );
    }
    if (type === "word") {
      return <WordViewer url={url} zoom={zoom} isUser={isUser} />;
    }
    if (type === "ppt") {
      return <PowerPointViewer url={url} zoom={zoom} isUser={isUser} />;
    }
    if (type === "excel") {
      return <ExcelViewer url={url} zoom={zoom} isUser={isUser} />;
    }
    if (type === "video") {
      return <VideoViewer url={url} isUser={isUser} />;
    }
    return (
      <div className="text-center py-10 px-4 text-sm sm:text-base text-gray-600">
        Unsupported document type
      </div>
    );
  };

  const shouldShowPagination = type === "pdf";

  return (
    <div className="w-full relative overflow-hidden document-viewer-container">
      {renderViewer()}
      {shouldShowPagination && totalPages && totalPages > 0 && (
        <div className="fixed bottom-0 left-140 right-0 flex justify-center pb-4  z-10">
          <DocumentPagination
            currentPage={currentPage || 1}
            totalPages={totalPages}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
            onGoToPage={onGoToPage}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            zoom={zoom}
          />
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
