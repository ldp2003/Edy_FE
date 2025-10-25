import React, { useState, useEffect } from "react";
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
  onPrevPage?: () => void;
  onNextPage?: () => void;
  onGoToPage?: (page: number) => void;
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
  const [displayPage, setDisplayPage] = useState(currentPage);

  // Update displayPage when currentPage changes
  useEffect(() => {
    setDisplayPage(currentPage);
  }, [currentPage]);

  // Auto-detect current page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const pageElements = document.querySelectorAll('[id^="pdf-page-"], [id^="word-page-"], [id^="excel-page-"]');
      if (pageElements.length === 0) return;

      const viewportHeight = window.innerHeight;
      let currentVisiblePage = 1;

      for (let i = 0; i < pageElements.length; i++) {
        const element = pageElements[i];
        const rect = element.getBoundingClientRect();

        // Check if page is visible in viewport (at least 50% visible)
        if (
          rect.top < viewportHeight * 0.5 &&
          rect.bottom > viewportHeight * 0.5
        ) {
          currentVisiblePage = i + 1;
          break;
        }
      }

      setDisplayPage(currentVisiblePage);
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalPages]);

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      setDisplayPage(page);
      if (onGoToPage) {
        onGoToPage(page);
      }
    }
  };

  const handlePageInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const page = parseInt((e.target as HTMLInputElement).value);
      if (page >= 1 && page <= totalPages && onGoToPage) {
        onGoToPage(page);
      }
    }
  };

  return (
    <div className="flex justify-center mt-4 sm:mt-6 px-4">
      <div className="bg-white border border-gray-300 rounded-full shadow-lg px-2 sm:px-3 py-1 flex items-center justify-center gap-1.5 sm:gap-2 h-fit max-w-xs sm:max-w-sm">
        {/* Previous Page Button */}
        <button
          onClick={() => onPrevPage?.()}
          disabled={disabled || currentPage <= 1}
          className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
          title="Trang trước"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        {/* Page Input */}
        <div className="flex items-center gap-1 sm:gap-2">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={displayPage}
            onChange={handlePageInputChange}
            onKeyPress={handlePageInputKeyPress}
            disabled={disabled}
            className="w-12 sm:w-16 px-1 sm:px-2 py-0.5 text-center border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100 text-sm"
          />
          <span className="text-gray-600 text-xs sm:text-sm">
            / {totalPages}
          </span>
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => onNextPage?.()}
          disabled={disabled || currentPage >= totalPages}
          className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
          title="Trang sau"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>

        {/* Divider */}
        {(onZoomIn || onZoomOut || onRotate) && (
          <div className="w-px h-5 sm:h-6 bg-gray-300 mx-1"></div>
        )}

        {/* Zoom Out Button */}
        {onZoomOut && (
          <button
            onClick={() => onZoomOut()}
            disabled={disabled}
            className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
            title="Thu nhỏ"
          >
            <ZoomOut size={16} className="text-gray-700" />
          </button>
        )}

        {/* Zoom Level Display */}
        {zoom && (
          <span className="text-xs sm:text-sm text-gray-600 min-w-[2.5rem] sm:min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
        )}

        {/* Zoom In Button */}
        {onZoomIn && (
          <button
            onClick={onZoomIn}
            disabled={disabled}
            className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
            title="Phóng to"
          >
            <ZoomIn size={16} className="text-gray-700" />
          </button>
        )}

        {/* Rotate Button */}
        {onRotate && (
          <button
            onClick={() => onRotate()}
            disabled={disabled}
            className="p-1 sm:p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
            title="Xoay"
          >
            <RotateCcw size={16} className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentPagination;
