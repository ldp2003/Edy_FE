import React from "react";
import { ArrowUp, ArrowDown, Search, ZoomIn, ZoomOut } from "lucide-react";
import DownloadButton from "../../../common/buttons/DownloadButton";

interface PageToolbarProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onDownload?: () => void;
  point: number;
}

const PageToolbar: React.FC<PageToolbarProps> = ({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onDownload,
  point,
}) => {
  return (
    <div className="flex items-center gap-2 px-2 py-2 bg-[#0057b8] rounded-2xl w-fit mx-auto shadow text-white">
      <button
        className="bg-white text-[#0057b8] rounded px-2 py-1 flex items-center text-xs font-bold hover:bg-blue-100 border border-blue-300"
        onClick={onPrev}
        disabled={currentPage <= 1}
      >
        <ArrowUp size={15} />
      </button>
      <button
        className="bg-white text-[#0057b8] rounded px-2 py-1 flex items-center text-xs font-bold hover:bg-blue-100 border border-blue-300"
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        <ArrowDown size={15} />
      </button>
      <span className="bg-white text-[#0057b8] rounded px-3 py-1 text-xs font-bold border border-blue-300">
        {currentPage} trên {totalPages} trang
      </span>
      <button
        className="bg-white text-[#0057b8] rounded px-2 py-1 flex items-center text-xs font-bold hover:bg-blue-100 border border-blue-300"
        onClick={onZoomOut}
        disabled={!onZoomOut}
      >
        <ZoomOut size={15} />
      </button>
      <button
        className="bg-white text-[#0057b8] rounded px-2 py-1 flex items-center text-xs font-bold hover:bg-blue-100 border border-blue-300"
        onClick={onZoomIn}
        disabled={!onZoomIn}
      >
        <ZoomIn size={15} />
      </button>
      <button
        className="bg-white text-[#0057b8] rounded px-2 py-1 flex items-center text-xs font-bold hover:bg-blue-100 border border-blue-300"
        onClick={onDownload}
        disabled={!onDownload}
      >
        <Search size={15} />
      </button>
      <DownloadButton point={point} />
    </div>
  );
};

export default PageToolbar;
