import React, { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import "../../../../docx-preview.css";

interface WordViewerProps {
  url: string;
  onPageChange?: (currentPage: number, totalPages: number) => void;
  currentPage?: number;
  onPageUpdate?: (page: number) => void;
}

const WordViewer: React.FC<WordViewerProps> = ({
  url,
  onPageChange,
  currentPage = 1,
  onPageUpdate,
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
    <div style={{ minHeight: 200 }}>
      {loading && <div>Đang tải file Word...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div
        ref={containerRef}
        className="docx-wrapper"
        style={{ width: "100%", overflowX: "auto" }}
      />
    </div>
  );
};

export default WordViewer;
