import React, { useEffect, useState } from "react";
import mammoth from "mammoth";
import LimitNotificationModal from "./LimitNotificationModal";
import LimitNotificationBanner from "./LimitNotificationBanner";

interface WordViewerProps {
  url: string;
  isUser?: boolean; // True if document belongs to current user
  zoom?: number; // Zoom level for the document
}

const WordViewer: React.FC<WordViewerProps> = ({
  url,
  isUser = false,
  zoom,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showLimitBanner, setShowLimitBanner] = useState(false);

  useEffect(() => {
    const fetchAndRender = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không thể tải file Word");
        const arrayBuffer = await res.arrayBuffer();

        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            styleMap: [
              "p[style-name='Heading 1'] => h1:fresh",
              "p[style-name='Heading 2'] => h2:fresh",
              "p[style-name='Heading 3'] => h3:fresh",
              "r[style-name='Strong'] => strong",
              "r[style-name='Emphasis'] => em",
              "table => table.table.table-bordered",
              "tr => tr",
              "td => td",
              "th => th",
            ],
          }
        );

        // Create temporary div to parse HTML
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = result.value;
        document.body.appendChild(tempDiv);

        // Exact measurements matching final render
        const contentWidth = 690; // 850px - 160px (80px left + 80px right padding)
        const pageContentHeight = 960; // 1100px - 140px (60px top + 80px bottom padding)

        const elements = Array.from(tempDiv.children) as HTMLElement[];
        const pagesHtml: string[] = [];
        let currentPageHtml = "";
        let currentPageHeight = 0;

        // Create measure div with exact styling as final render
        const measureDiv = document.createElement("div");
        measureDiv.style.cssText = `
          position: absolute;
          left: -9999px;
          top: -9999px;
          width: ${contentWidth}px;
          font-size: 14px;
          line-height: 1.6;
          visibility: hidden;
        `;
        document.body.appendChild(measureDiv);

        for (let i = 0; i < elements.length; i++) {
          const element = elements[i] as HTMLElement;

          // Clone and measure element
          const clonedElement = element.cloneNode(true) as HTMLElement;
          measureDiv.innerHTML = "";
          measureDiv.appendChild(clonedElement);

          // Force reflow for accurate measurement
          void measureDiv.offsetHeight;
          const elementHeight = measureDiv.scrollHeight;

          // Special handling for tables, images, and headings - keep them on same page if possible
          const isTable = element.tagName.toLowerCase() === "table";
          const isHeading = /^h[1-6]$/i.test(element.tagName);
          const isLargeElement = elementHeight > pageContentHeight * 0.5; // More than 50% of page

          // Check if adding this element would exceed page height
          const wouldExceedPage =
            currentPageHeight + elementHeight > pageContentHeight;

          // Prevent orphaned headings - if heading at bottom of page, move to next page
          const hasNextElement = i < elements.length - 1;
          const isOrphanedHeading =
            isHeading && wouldExceedPage && hasNextElement;

          if (wouldExceedPage && currentPageHtml) {
            // Always start new page if current is full
            pagesHtml.push(currentPageHtml);
            currentPageHtml = element.outerHTML;
            currentPageHeight = elementHeight;
          } else if (
            isOrphanedHeading &&
            currentPageHeight > pageContentHeight * 0.2
          ) {
            // Prevent heading at very bottom - move to next page if current page has enough content
            pagesHtml.push(currentPageHtml);
            currentPageHtml = element.outerHTML;
            currentPageHeight = elementHeight;
          } else if (isLargeElement && !isTable) {
            // Large non-table elements: if can't fit on current page, give it own page
            if (currentPageHtml && currentPageHeight > 0) {
              pagesHtml.push(currentPageHtml);
              currentPageHtml = element.outerHTML;
              currentPageHeight = elementHeight;
            } else {
              currentPageHtml = element.outerHTML;
              currentPageHeight = elementHeight;
            }
          } else {
            // Normal case: add to current page
            currentPageHtml += element.outerHTML;
            currentPageHeight += elementHeight;
          }
        }

        // Add final page if it has content
        if (currentPageHtml) {
          pagesHtml.push(currentPageHtml);
        }

        // Cleanup
        document.body.removeChild(measureDiv);
        document.body.removeChild(tempDiv);

        // Limit to 10 pages
        const limitedPages = isUser ? pagesHtml : pagesHtml.slice(0, 10);
        setPages(limitedPages);

        if (!isUser && pagesHtml.length > 10) {
          setShowLimitBanner(true);
        }
      } catch (e) {
        console.error(e);
        setError("Không thể xem trước file Word");
      }
      setLoading(false);
    };

    fetchAndRender();
  }, [url, isUser]);

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
        className="px-1 sm:px-2 md:px-4 relative"
        style={{
          transform: `scale(${zoom || 1})`,
          transformOrigin: "top center",
          transition: "transform 0.2s ease-in-out",
        }}
      >
        {pages.map((pageHtml, index) => (
          <div
            key={index}
            className="relative mb-8 bg-white rounded-lg shadow-lg mx-auto"
            style={{
              width: "100%",
              maxWidth: "850px",
              minHeight: "1100px",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.06)",
              border: "1px solid #e5e7eb",
              padding: "60px 80px 80px 80px",
              pageBreakAfter: "always",
              pageBreakInside: "avoid",
            }}
          >
            <div
              className="mammoth-wrapper"
              dangerouslySetInnerHTML={{ __html: pageHtml }}
              style={{
                width: "100%",
                lineHeight: "1.6",
                fontSize: "14px",
                color: "#000",
              }}
            />
            {/* Số trang ở góc dưới phải */}
            <div
              style={{
                position: "absolute",
                bottom: "40px",
                right: "80px",
                fontSize: "11px",
                color: "#666",
                fontFamily: "Arial, sans-serif",
                userSelect: "none",
              }}
            >
              {index + 1}
            </div>
          </div>
        ))}
      </div>

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
