/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";

// Nếu bạn để worker ở /public/pdf.worker.min.mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface SecurePdfViewerProps {
  url: string;
}

const SecurePdfViewer: React.FC<SecurePdfViewerProps> = ({ url }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedUrlRef = useRef<string | null>(null); // 🔒 Ngăn render lặp URL giống nhau

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Nếu URL giống lần trước => không render lại
    if (renderedUrlRef.current === url) return;
    renderedUrlRef.current = url;

    // Dọn trước khi render
    container.innerHTML = "";

    const renderPDF = async () => {
      try {
        container.innerHTML =
          "<div style='text-align:center;padding:20px;color:gray;'>Đang tải PDF...</div>";

        const loadingTask = pdfjsLib.getDocument({
          url: url,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        container.innerHTML = "";

        // Duyệt từng trang
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.2 });

          const pageContainer = document.createElement("div");
          pageContainer.style.marginBottom = "10px";
          pageContainer.style.textAlign = "center";

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (!context) throw new Error("Cannot get 2D context");

          canvas.height = viewport.height;
          canvas.width = viewport.width;
          canvas.style.maxWidth = "100%";
          canvas.style.height = "auto";
          canvas.style.userSelect = "none";
          canvas.style.pointerEvents = "none";

          // 👇 thêm thuộc tính `canvas` để tương thích PDF.js 5.x
          const renderContext: any = {
            canvasContext: context,
            viewport,
            canvas,
          };

          await page.render(renderContext).promise;

          pageContainer.appendChild(canvas);
          container.appendChild(pageContainer);
        }
      } catch (error) {
        console.error("Lỗi khi render PDF:", error);
        container.innerHTML = `
          <div style='text-align:center;padding:20px;color:#ef4444;'>
            <p>Không thể xem trước file PDF.</p>
            <p style='font-size:12px;color:#666;margin-top:10px;'>
              ${error instanceof Error ? error.message : "Unknown error"}
            </p>
          </div>
        `;
      }
    };

    renderPDF();

    return () => {
      if (container) {
        container.innerHTML = "";
        renderedUrlRef.current = null; // reset khi unmount
      }
    };
  }, [url]);

  return (
    <div
      ref={containerRef}
      className="overflow-auto h-full bg-gray-50 p-2 select-none"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    />
  );
};

export default SecurePdfViewer;
