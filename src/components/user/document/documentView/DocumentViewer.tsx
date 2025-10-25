import React, { useState } from "react";

import WordViewer from "./WordViewer";
import PDFViewer from "./PDFViewer";
import ExcelTable from "./ExcelTable";

interface DocumentViewerProps {
  url: string;
  type: "pdf" | "ppt" | "excel" | "video" | "word";
  onPageChange?: (currentPage: number, totalPages: number) => void;
  currentPage?: number;
  onPageUpdate?: (page: number) => void;
  zoom?: number;
  isUser?: boolean; // True if document belongs to current user (no limitations)
}

const VideoViewer: React.FC<{ url: string; isUser?: boolean }> = ({
  url,
  isUser = false,
}) => {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative w-full">
      <video
        src={url}
        controls
        controlsList="nodownload"
        className="w-full max-h-[80vh] bg-black"
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (!isUser && video.currentTime >= 60) {
            video.pause();
            video.currentTime = 60;
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
              Bạn chỉ được xem trước 1 phút đầu.
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
}) => {
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
        currentPage={currentPage}
        onPageUpdate={onPageUpdate}
        isUser={isUser}
      />
    );
  }
  if (type === "ppt") {
    return (
      <div className="text-center py-10 px-4 text-sm sm:text-base text-gray-600">
        Chưa hỗ trợ xem trực tiếp PowerPoint. Vui lòng chuyển sang PDF hoặc
        Excel.
      </div>
    );
  }
  if (type === "excel") {
    return <ExcelTable url={url} isUser={isUser} />;
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

export default DocumentViewer;
