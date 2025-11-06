import React, { useState } from "react";

import WordViewer from "./WordViewer";
import PDFViewer from "./PDFViewer";
import ExcelViewer from "./ExcelViewer";
import PowerPointViewer from "./PowerPointViewer";
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

const VideoViewer: React.FC<{ url: string; isUser?: boolean }> = ({
  url,
  isUser = false,
}) => {
  const [paused, setPaused] = useState(false);
  const [previewLimit, setPreviewLimit] = useState<number>(0);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    // Set preview limit to 10% of total duration
    const limit = video.duration * 0.1;
    setPreviewLimit(limit);
  };

  return (
    <div className="relative w-full">
      <video
        src={url}
        controls
        controlsList="nodownload"
        className="w-full max-h-[80vh] bg-black"
        onContextMenu={(e) => e.preventDefault()}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (
            !isUser &&
            previewLimit > 0 &&
            video.currentTime >= previewLimit
          ) {
            video.pause();
            video.currentTime = previewLimit;
            setPaused(true);
          }
        }}
      >
        Trình duyệt của bạn không hỗ trợ video.
      </video>
      {paused && !isUser && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex flex-col items-center justify-center text-white z-10 px-4">
          <div className="text-center">
            <p className="text-base sm:text-lg font-semibold mb-2">
              Bạn chỉ được xem trước 10% thời lượng video.
            </p>
            <p className="text-sm sm:text-base">
              Vui lòng tải xuống để xem toàn bộ video.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

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
      return (
        <WordViewer
          url={url}
          onPageChange={onPageChange}
          zoom={zoom}
          isUser={isUser}
        />
      );
    }
    if (type === "ppt") {
      return <PowerPointViewer url={url} zoom={zoom} />;
    }
    if (type === "excel") {
      return <ExcelViewer url={url} zoom={zoom} />;
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

  const shouldShowPagination = type === "pdf" || type === "word";

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
