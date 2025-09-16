import React, { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import "../../../../docx-preview.css";

interface WordViewerProps {
  url: string;
}

const WordViewer: React.FC<WordViewerProps> = ({ url }) => {
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
        }
      } catch (e) {
        console.error(e);
        setError("Không thể xem trước file Word");
      }
      setLoading(false);
    };

    fetchAndRender();
  }, [url]);

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
