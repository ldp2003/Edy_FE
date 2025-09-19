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
}

const VideoViewer: React.FC<{ url: string }> = ({ url }) => {
  const [paused, setPaused] = useState(false);

  return (
    <div className="relative">
      <video
        src={url}
        controls
        controlsList="nodownload"
        className="w-full max-h-[80vh] bg-black"
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          if (video.currentTime >= 60) {
            video.pause();
            video.currentTime = 60;
            setPaused(true);
          }
        }}
      >
        Trình duyệt của bạn không hỗ trợ video.
      </video>
      {paused && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex flex-col items-center justify-center text-white z-10">
          <div className="mb-4 text-lg font-semibold">
            Bạn chỉ được xem trước 1 phút đầu.
            <br />
            Vui lòng tải xuống để xem toàn bộ video.
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
}) => {
  if (type === "pdf") {
    return (
      <PDFViewer
        url={url}
        onPageChange={onPageChange}
        currentPage={currentPage}
        onPageUpdate={onPageUpdate}
        zoom={zoom}
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
      />
    );
  }
  if (type === "ppt") {
    return (
      <div>
        Chưa hỗ trợ xem trực tiếp PowerPoint. Vui lòng chuyển sang PDF hoặc
        Excel.
      </div>
    );
  }
  if (type === "excel") {
    return <ExcelTable url={url} />;
  }
  if (type === "video") {
    return <VideoViewer url={url} />;
  }
  return <div>Unsupported document type</div>;
};

export default DocumentViewer;
