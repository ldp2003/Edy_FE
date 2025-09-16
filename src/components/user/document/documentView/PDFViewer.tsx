import React, { useState, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "../../../../../public/pdf.worker.min.mjs";

interface PDFViewerProps {
  url: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ url }) => {
  const [pdfDocument, setPdfDocument] =
    useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [canvases, setCanvases] = useState<string[]>([]);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(url).promise;
        console.log("Loaded PDF:", pdfDocument);
        setPdfDocument(pdf);
        await renderPages(pdf);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPDF();
  }, [url]);

  const renderPages = async (pdf: pdfjsLib.PDFDocumentProxy) => {
    const pageCount = Math.min(10, pdf.numPages);
    const canvasImages: string[] = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context!, viewport, canvas }).promise;
      canvasImages.push(canvas.toDataURL());
    }

    setCanvases(canvasImages);
    console.log("Rendered canvases:", canvases);
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="mb-5"></div>
      <div className="space-y-6 w-full h-0">
        {canvases.map((imgSrc, index) => (
          <div key={index} className="mb-7 border border-gray-300 rounded-lg">
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
