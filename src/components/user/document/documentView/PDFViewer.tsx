import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../../../../../public/pdf.worker.min.mjs";

interface PDFViewerProps {
  url: string;
  onPageChange?: (currentPage: number, totalPages: number) => void;
  currentPage?: number;
  onPageUpdate?: (page: number) => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  url,
  onPageChange,
  currentPage = 1,
  onPageUpdate,
}) => {
  const [pdfDocument, setPdfDocument] =
    useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [canvases, setCanvases] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.5);
  const [visiblePage, setVisiblePage] = useState(1);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        console.log("Loaded PDF:", pdf);
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);

        // Notify parent about total pages
        if (onPageChange) {
          onPageChange(1, pdf.numPages);
        }

        await renderPages(pdf);
      } catch (error) {
        console.error("Error loading PDF:", error);
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

  const renderPages = async (pdf: pdfjsLib.PDFDocumentProxy) => {
    const pageCount = pdf.numPages;
    const canvasImages: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: zoom });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context!, viewport, canvas }).promise;
      canvasImages.push(canvas.toDataURL());
    }

    setCanvases(canvasImages);
    console.log("Rendered canvases:", canvasImages.length);
  };

  const scrollToPage = (pageNumber: number) => {
    const pageElement = document.getElementById(`pdf-page-${pageNumber}`);
    if (pageElement) {
      pageElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleZoomIn = () => {
    if (pdfDocument && zoom < 3) {
      const newZoom = zoom + 0.25;
      setZoom(newZoom);
      renderPages(pdfDocument);
    }
  };

  const handleZoomOut = () => {
    if (pdfDocument && zoom > 0.5) {
      const newZoom = zoom - 0.25;
      setZoom(newZoom);
      renderPages(pdfDocument);
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
      <div className="mb-5"></div>
      <div className="space-y-6 w-full">
        {canvases.map((imgSrc, index) => (
          <div
            key={index}
            id={`pdf-page-${index + 1}`}
            className="mb-7 border border-gray-300 rounded-lg"
          >
            <img
              src={imgSrc}
              alt={`Page ${index + 1}`}
              className="w-full h-auto rounded-2xl hover:shadow-lg transition-shadow duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFViewer;
