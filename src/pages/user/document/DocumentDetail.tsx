import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import DocumentSide from "../../../components/user/document/documentDetail/DocumentSide";
import MobileDocumentHeader from "../../../components/user/document/documentDetail/MobileDocumentHeader";
import DocumentViewer from "../../../components/user/document/documentView/DocumentViewer";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";
import { UserContext } from "../../../contexts/UserContext";
import AuthorInfo from "../../../components/common/userInfo/AuthorInfo";
import DocumentActions from "../../../components/user/document/documentDetail/DocumentActions";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn, user, addToReadHistory } = useContext(UserContext);
  const addToReadHistoryRef = useRef(addToReadHistory);

  // Update ref when addToReadHistory changes
  useEffect(() => {
    addToReadHistoryRef.current = addToReadHistory;
  }, [addToReadHistory]);

  // Reset view flag when id changes
  useEffect(() => {
    hasAddedViewRef.current = false;
  }, [id]);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const hasAddedViewRef = useRef(false);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Fetch document data
  const fetchDocument = useCallback(async () => {
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
        void addToReadHistoryRef.current(documentData);
      }

      // Check if this is a reload or back navigation to avoid adding view count
      const nav = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      const isReloadOrBack =
        nav && (nav.type === "reload" || nav.type === "back_forward");

      // Add view count only if not reload or back and not already added
      if (!isReloadOrBack && !hasAddedViewRef.current) {
        try {
          await DocumentService.addViewCount(id);
          hasAddedViewRef.current = true;
        } catch (error) {
          console.error("Error adding view count:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setDocument(null);
    } finally {
      setLoading(false);
    }
  }, [id, isLoggedIn]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

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

  // Check if current user is the owner of the document
  const isUserOwner = Boolean(
    document && user && document.publisher === user._id
  );

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Document Side - ẩn trên mobile và tablet, hiện trên desktop */}
      <div className="hidden lg:block lg:w-80">
        <DocumentSide document={document!} />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileDocumentHeader document={document!} />
      </div>

      {/* Main content - có thể scroll */}
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="p-4">
          <div className="hidden lg:flex flex-col">
            <AuthorInfo document={document!} />
            <DocumentActions document={document!} />
          </div>

          <DocumentViewer
            url={document!.url}
            type={getViewerFileType(document!.file_type)}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            onPageUpdate={handlePageUpdate}
            zoom={zoom}
            isUser={isUserOwner}
            totalPages={totalPages}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onGoToPage={handleGoToPage}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
