import React, { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import "../../../../docx-preview.css";

interface WordViewerProps {
  url: string;
  onPageChange?: (currentPage: number, totalPages: number) => void;
  currentPage?: number;
  onPageUpdate?: (page: number) => void;
  isUser?: boolean; // True if document belongs to current user
}

const WordViewer: React.FC<WordViewerProps> = ({
  url,
  onPageChange,
  isUser = false, // eslint-disable-line @typescript-eslint/no-unused-vars
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

          // For Word documents, we simulate pagination by treating the document as 1 page
          // In a real implementation, you might want to calculate pages based on content height
          if (onPageChange) {
            onPageChange(1, 1);
          }
        }
      } catch (e) {
        console.error(e);
        setError("Không thể xem trước file Word");
      }
      setLoading(false);
    };

    fetchAndRender();
  }, [url, onPageChange]);

  return (
    <div className="w-full lg:max-w-[1400px] z-0 min-h-[200px]">
      {loading && (
        <div className="flex items-center justify-center py-10">
          <div className="text-gray-600 text-sm sm:text-base">Đang tải file Word...</div>
        </div>
      )}
      {error && (
        <div className="text-red-600 text-sm sm:text-base px-4 py-3 bg-red-50 rounded-lg mx-2 sm:mx-4">
          {error}
        </div>
      )}
      <div
        ref={containerRef}
        className="docx-wrapper px-2 sm:px-4"
        style={{ width: "100%", overflowX: "auto" }}
      />
    </div>
  );
};

export default WordViewer;
