import React, { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import "../../../../docx-preview.css";
import LimitNotificationModal from "./LimitNotificationModal";
import LimitNotificationBanner from "./LimitNotificationBanner";

interface WordViewerProps {
  url: string;
  zoom?: number;
  isUser?: boolean; // True if document belongs to current user
}

const WordViewer: React.FC<WordViewerProps> = ({
  url,
  zoom = 1,
  isUser = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const [showLimitBanner, setShowLimitBanner] = useState(false);

  useEffect(() => {
    const fetchAndRender = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không thể tải file Word");
        const blob = await res.blob();

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          // render file .docx vào container
          await renderAsync(blob, containerRef.current, undefined, {
            className: "docx-preview-content",
            inWrapper: false,
          });

          // Calculate pages based on content height
          // Assuming a standard page height of 800px for pagination
          const contentHeight = containerRef.current.scrollHeight;
          const pageHeight = 800; // Approximate height of one page in pixels
          const calculatedTotalPages = Math.max(
            1,
            Math.ceil(contentHeight / pageHeight)
          );

          // Limit content height for non-users and show banner
          if (!isUser && calculatedTotalPages > 10) {
            containerRef.current.style.maxHeight = `${pageHeight * 10}px`;
            containerRef.current.style.overflow = "hidden";
            containerRef.current.style.position = "relative";
            setShowLimitBanner(true);
          }
        }
      } catch (e) {
        console.error(e);
        setError("Không thể xem trước file Word");
      }
      setLoading(false);
    };

    fetchAndRender();
  }, [url, isUser]);

  // Detect when user scrolls to the bottom of the 10-page limit
  useEffect(() => {
    if (isUser || hasShownModal) return;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if user has scrolled near the bottom (within 100px)
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 100;

      // Check if container has height limit (10 pages)
      const hasHeightLimit =
        container.style.maxHeight && container.style.maxHeight !== "none";

      if (isNearBottom && hasHeightLimit && !hasShownModal) {
        setShowLimitModal(true);
        setHasShownModal(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isUser, hasShownModal]);

  const handleModalClose = () => {
    setShowLimitModal(false);
  };

  return (
    <div className="w-full max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl z-0 min-h-[200px] mx-auto word-viewer-wrapper">
      {loading && (
        <div className="flex items-center justify-center py-8 px-4">
          <div className="text-gray-600 text-sm sm:text-base text-center">
            Đang tải file Word...
          </div>
        </div>
      )}
      {error && (
        <div className="text-red-600 text-sm sm:text-base px-3 sm:px-4 py-3 bg-red-50 rounded-lg mx-2 sm:mx-4">
          {error}
        </div>
      )}
      <div
        ref={containerRef}
        className="docx-wrapper px-1 sm:px-2 md:px-4 relative"
        style={{
          width: "100%",
          overflowX: "auto",
          fontSize: `${14 * zoom}px`,
          lineHeight: "1.4",
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}
      ></div>

      {/* Limit notification banner below content for non-users */}
      {showLimitBanner && (
        <LimitNotificationBanner
          title="Bạn đã xem hết 10 trang đầu"
          message="Đăng ký tài khoản để xem toàn bộ nội dung tài liệu Word"
          icon="📖"
        />
      )}

      {/* Modal thông báo đã xem hết giới hạn */}
      {showLimitModal && (
        <LimitNotificationModal
          visible={showLimitModal}
          onClose={handleModalClose}
          message="Bạn đã xem hết giới hạn của tài liệu Word. Để xem toàn bộ nội dung, vui lòng đăng ký tài khoản."
        />
      )}
    </div>
  );
};

export default WordViewer;
