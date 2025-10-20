import React, { useState, useCallback, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { User } from "lucide-react";
import DocumentSide from "../../../components/user/document/documentDetail/DocumentSide";
import MobileDocumentHeader from "../../../components/user/document/documentDetail/MobileDocumentHeader";
import AuthorInfo from "../../../components/common/userInfo/AuthorInfo";
import DocumentViewer from "../../../components/user/document/documentView/DocumentViewer";
import DocumentPagination from "../../../components/user/document/documentView/DocumentPagination";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";
import { UserContext } from "../../../contexts/UserContext";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, addToReadHistory } = useContext(UserContext);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthor, setShowAuthor] = useState(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.5);

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const documentData = await DocumentService.getDocumentById(id);
        setDocument(documentData);

        // Add to read history if user is logged in
        if (isLoggedIn && documentData) {
          addToReadHistory(documentData);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setDocument(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, isLoggedIn, addToReadHistory]);

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

  // Map file type from backend to viewer expected format
  const getViewerFileType = (
    fileType: string
  ): "pdf" | "word" | "excel" | "video" | "ppt" => {
    const typeMap: {
      [key: string]: "pdf" | "word" | "excel" | "video" | "ppt";
    } = {
      PDF: "pdf",
      WORD: "word",
      EXCEL: "excel",
      VIDEO: "video",
      POWERPOINT: "ppt",
    };
    return typeMap[fileType] || "pdf";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải tài liệu...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Không tìm thấy tài liệu
          </h2>
          <p className="text-gray-600">
            Tài liệu bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Document Side - ẩn trên mobile, hiện trên desktop */}
      <div className="hidden md:block md:w-80">
        <DocumentSide document={document!} />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileDocumentHeader document={document!} />
      </div>

      {/* Main content - có thể scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Mobile Author Button */}
          <div className="fixed bottom-4 right-4 md:hidden z-50">
            <button
              onClick={() => setShowAuthor(!showAuthor)}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[var(--primary-color)] border border-[var(--border-color)]"
            >
              <User size={24} />
            </button>
          </div>

          {/* Mobile Author Panel */}
          {showAuthor && (
            <div className="md:hidden fixed bottom-20 right-4 bg-white shadow-lg rounded-lg z-40 p-4 w-72 animate-in slide-in-from-right">
              <AuthorInfo document={document!} />
            </div>
          )}

          {/* Desktop Author Info */}
          <div className="hidden md:block mb-4">
            <AuthorInfo document={document!} />
          </div>

          <DocumentViewer
            url={document!.url}
            type={getViewerFileType(document!.file_type)}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            onPageUpdate={handlePageUpdate}
            zoom={zoom}
          />
        </div>
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
