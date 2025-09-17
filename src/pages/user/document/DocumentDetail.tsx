import React, { useState, useCallback } from "react";
import DocumentSide from "../../../components/user/document/documentDetail/DocumentSide";
import DocumentActions from "../../../components/user/document/documentDetail/DocumentActions";
import AuthorInfo from "../../../components/common/userInfo/AuthorInfo";
import DocumentViewer from "../../../components/user/document/documentView/DocumentViewer";
import DocumentPagination from "../../../components/user/document/documentView/DocumentPagination";

const DocumentDetail: React.FC = () => {
  const pdfUrl =
    "https://res.cloudinary.com/dyd5381vx/image/upload/v1744799325/conversations/conv267250408133710/files/gkgtceyb3mx4gzdc87st.pdf";
  const typeFile = "pdf"; // Hoặc 'pdf' tùy thuộc vào loại file bạn muốn hiển thị

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.5);

  // Handle page change from document viewer
  const handlePageChange = useCallback((current: number, total: number) => {
    setCurrentPage(current);
    setTotalPages(total);
  }, []);

  // Handle page update from scroll
  const handlePageUpdate = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Navigation functions
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGoToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 3) {
      setZoom(zoom + 0.25);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.25);
    }
  };

  return (
    <div className="p-4 text-left">
      <DocumentSide></DocumentSide>
      <div className="!ml-[20%] ">
        <AuthorInfo></AuthorInfo>
        <DocumentActions />
        <DocumentViewer
          url={pdfUrl}
          type={typeFile}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          onPageUpdate={handlePageUpdate}
        />
      </div>

      {/* Fixed Pagination Bar */}
      {totalPages > 0 && (
        <DocumentPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          onGoToPage={handleGoToPage}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          zoom={zoom}
        />
      )}
    </div>
  );
};

export default DocumentDetail;
