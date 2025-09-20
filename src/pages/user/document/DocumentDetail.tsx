import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { message } from "antd";
import DocumentSide from "../../../components/user/document/documentDetail/DocumentSide";
import DocumentActions from "../../../components/user/document/documentDetail/DocumentActions";
import AuthorInfo from "../../../components/common/userInfo/AuthorInfo";
import DocumentViewer from "../../../components/user/document/documentView/DocumentViewer";
import DocumentPagination from "../../../components/user/document/documentView/DocumentPagination";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.5);

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        messageApi.error("ID tài liệu không hợp lệ!");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const documentData = await DocumentService.getDocumentById(id);
        setDocument(documentData);
      } catch (error) {
        console.error("Error fetching document:", error);
        messageApi.error("Không thể tải thông tin tài liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, messageApi]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải tài liệu...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy tài liệu!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-left">
      {contextHolder}
      <DocumentSide document={document} />
      <div className="!ml-[23%] ">
        <AuthorInfo document={document} />
        <DocumentActions document={document} />
        <DocumentViewer
          url={document.url}
          type={getViewerFileType(document.file_type)}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          onPageUpdate={handlePageUpdate}
          zoom={zoom}
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
