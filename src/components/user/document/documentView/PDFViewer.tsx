import React, { useState, useEffect, useCallback } from "react";
import { Button, Typography, Card } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import * as pdfjsLib from "pdfjs-dist";

const { Text } = Typography;

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../../../../../public/pdf.worker.min.mjs";

interface PDFViewerProps {
  url: string;
  onPageChange?: (currentPage: number, totalPages: number) => void;
  currentPage?: number;
  onPageUpdate?: (page: number) => void;
  zoom?: number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  url,
  onPageChange,
  currentPage = 1,
  onPageUpdate,
  zoom = 1.5,
}) => {
  const [pdfDocument, setPdfDocument] =
    useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [canvases, setCanvases] = useState<string[]>([]);
  const [visiblePage, setVisiblePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if URL is accessible
        const response = await fetch(url, { method: "HEAD" });
        if (!response.ok) {
          if (response.status === 401) {
            setError(
              "Không có quyền truy cập tài liệu này. Vui lòng liên hệ người tải lên."
            );
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const pdf = await pdfjsLib.getDocument(url).promise;
        console.log("Loaded PDF:", pdf);
        setPdfDocument(pdf);

        await renderPages(pdf);
      } catch (error) {
        console.error("Error loading PDF:", error);
        if (error instanceof Error) {
          if (error.message.includes("401")) {
            setError(
              "Không có quyền truy cập tài liệu này. Vui lòng liên hệ người tải lên."
            );
          } else if (error.message.includes("404")) {
            setError(
              "Không tìm thấy tài liệu. Có thể tài liệu đã bị xóa hoặc di chuyển."
            );
          } else {
            setError("Không thể tải tài liệu. Vui lòng thử lại sau.");
          }
        } else {
          setError("Đã xảy ra lỗi không xác định khi tải tài liệu.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadPDF();
  }, [url]); // Removed dependencies to fix lint warning

  useEffect(() => {
    // Update visible page when currentPage prop changes
    if (currentPage !== visiblePage) {
      setVisiblePage(currentPage);
      scrollToPage(currentPage);
    }
  }, [currentPage, visiblePage]);

  // Re-render pages when zoom changes
  useEffect(() => {
    if (pdfDocument) {
      renderPages(pdfDocument);
    }
  }, [zoom, pdfDocument]);

  const renderPages = useCallback(
    async (pdf: pdfjsLib.PDFDocumentProxy) => {
      const pageCount = Math.min(pdf.numPages, 10); // Giới hạn chỉ 10 trang đầu
      const canvasImages: string[] = [];

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: zoom });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context!, viewport, canvas })
          .promise;
        canvasImages.push(canvas.toDataURL());
      }

      setCanvases(canvasImages);

      // Notify parent about limited pages (not total pages)
      if (onPageChange) {
        onPageChange(1, pageCount);
      }

      console.log("Rendered canvases:", canvasImages.length);
    },
    [zoom, onPageChange]
  );

  const scrollToPage = (pageNumber: number) => {
    const pageElement = document.getElementById(`pdf-page-${pageNumber}`);
    if (pageElement) {
      pageElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Handle scroll to update current page
  useEffect(() => {
    const handleScroll = () => {
      const pageElements = document.querySelectorAll('[id^="pdf-page-"]');
      const viewportHeight = window.innerHeight;

      for (let i = 0; i < pageElements.length; i++) {
        const element = pageElements[i];
        const rect = element.getBoundingClientRect();

        // Check if page is visible in viewport (at least 50% visible)
        if (
          rect.top < viewportHeight * 0.5 &&
          rect.bottom > viewportHeight * 0.5
        ) {
          const pageNum = i + 1;
          if (pageNum !== visiblePage) {
            setVisiblePage(pageNum);
            if (onPageUpdate) {
              onPageUpdate(pageNum);
            }
          }
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visiblePage, onPageUpdate]);

  return (
    <div className="max-w-full mx-auto">
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Đang tải tài liệu...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <div className="text-red-600 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Không thể tải tài liệu
            </h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-5"></div>
          <div className="space-y-6 w-full">
            {canvases.map((imgSrc, index) => (
              <div
                key={index}
                id={`pdf-page-${index + 1}`}
                className="mb-7 border border-gray-300 h-[80%] mx-[10%] rounded-lg"
              >
                <img
                  src={imgSrc}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto rounded-2xl hover:shadow-lg transition-shadow duration-300"
                />
              </div>
            ))}

            {/* Thông báo giới hạn xem */}
            {canvases.length >= 10 && (
              <Card className="border-orange-200 bg-orange-50 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-orange-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <Text className="text-orange-700 font-medium">
                      Bạn đã xem hết 10 trang đầu tiên
                    </Text>
                  </div>
                  <Text className="text-orange-600 text-sm">
                    Để xem toàn bộ tài liệu, vui lòng tải xuống file PDF
                  </Text>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    className="bg-orange-500 border-orange-500 hover:bg-orange-600"
                    onClick={() => window.open(url, "_blank")}
                  >
                    Tải xuống file PDF
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PDFViewer;
