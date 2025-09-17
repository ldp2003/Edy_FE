import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface DocumentPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotate?: () => void;
  zoom?: number;
  disabled?: boolean;
}

const DocumentPagination: React.FC<DocumentPaginationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  onGoToPage,
  onZoomIn,
  onZoomOut,
  onRotate,
  zoom,
  disabled = false,
}) => {
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      onGoToPage(page);
    }
  };

  const handlePageInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const page = parseInt((e.target as HTMLInputElement).value);
      if (page >= 1 && page <= totalPages) {
        onGoToPage(page);
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-gray-300 rounded-full shadow-lg px-4 py-2 flex items-center gap-3">
        {/* Previous Page Button */}
        <button
          onClick={onPrevPage}
          disabled={disabled || currentPage <= 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Trang trước"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        {/* Page Input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={handlePageInputChange}
            onKeyPress={handlePageInputKeyPress}
            disabled={disabled}
            className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
          <span className="text-gray-600 text-sm">/ {totalPages}</span>
        </div>

        {/* Next Page Button */}
        <button
          onClick={onNextPage}
          disabled={disabled || currentPage >= totalPages}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Trang tiếp theo"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>

        {/* Divider */}
        {(onZoomIn || onZoomOut || onRotate) && (
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
        )}

        {/* Zoom Out Button */}
        {onZoomOut && (
          <button
            onClick={onZoomOut}
            disabled={disabled}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Thu nhỏ"
          >
            <ZoomOut size={18} className="text-gray-700" />
          </button>
        )}

        {/* Zoom Level Display */}
        {zoom && (
          <span className="text-sm text-gray-600 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
        )}

        {/* Zoom In Button */}
        {onZoomIn && (
          <button
            onClick={onZoomIn}
            disabled={disabled}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Phóng to"
          >
            <ZoomIn size={18} className="text-gray-700" />
          </button>
        )}

        {/* Rotate Button */}
        {onRotate && (
          <button
            onClick={onRotate}
            disabled={disabled}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Xoay"
          >
            <RotateCcw size={18} className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentPagination;
