import React, { useState, useCallback, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { UserContext } from "../../../contexts/UserContext";
import DocumentSide from "../../../components/user/document/documentDetail/DocumentSide";
import DocumentActions from "../../../components/user/document/documentDetail/DocumentActions";
import AuthorInfo from "../../../components/common/userInfo/AuthorInfo";
import DocumentViewer from "../../../components/user/document/documentView/DocumentViewer";
import DocumentPagination from "../../../components/user/document/documentView/DocumentPagination";
import DocumentAccessError from "../../../components/common/error/DocumentAccessError";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";

const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState<{
    type: "private" | "restricted" | "not-found" | "unauthorized";
    message?: string;
  } | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1.5);

  // Function to check document access permission
  const checkDocumentAccess = useCallback(
    (doc: Document, currentUser: typeof user) => {
      // Kiểm tra xem tài liệu có bị xóa không
      if (doc.is_deleted) {
        return {
          hasAccess: false,
          type: "not-found" as const,
          message: "Tài liệu đã bị xóa.",
        };
      }

      // Kiểm tra public mode
      switch (doc.public_mode) {
        case "PRIVATE":
          // Chỉ tác giả mới có thể xem
          if (!currentUser || doc.user._id !== currentUser._id) {
            return { hasAccess: false, type: "private" as const };
          }
          break;

        case "PRIVATE_SHARED":
          // Tác giả và những người được chia sẻ (tạm thời cho phép truy cập)
          if (!currentUser || doc.user._id !== currentUser._id) {
            return { hasAccess: false, type: "restricted" as const };
          }
          break;

        case "SHARE_ORGANIZATION":
          // Chỉ những người trong cùng tổ chức
          if (
            !currentUser ||
            (doc.user._id !== currentUser._id &&
              (!currentUser.organization ||
                (typeof doc.user.organization === "object"
                  ? doc.user.organization._id
                  : doc.user.organization) !==
                  (typeof currentUser.organization === "object"
                    ? currentUser.organization._id
                    : currentUser.organization)))
          ) {
            return {
              hasAccess: false,
              type: "restricted" as const,
              message: "Tài liệu chỉ dành cho thành viên trong tổ chức.",
            };
          }
          break;

        case "PUBLIC":
        default:
          // Công khai - ai cũng có thể xem
          break;
      }

      return { hasAccess: true };
    },
    []
  );

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        setAccessError({
          type: "not-found",
          message: "ID tài liệu không hợp lệ!",
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const documentData = await DocumentService.getDocumentById(id);

        // Kiểm tra xem tài liệu có thuộc về người dùng hiện tại không
        if (user && documentData.user._id === user._id) {
          // Nếu là tài liệu của người dùng, chuyển hướng sang PersonalPostDetail
          navigate(`/personal-posts/document-detail/${id}`, { replace: true });
          return;
        }
        setDocument(documentData);
      } catch (error) {
        console.error("Error fetching document:", error);
        setAccessError({
          type: "not-found",
          message: "Không thể tải thông tin tài liệu!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, messageApi, user, navigate, checkDocumentAccess]);

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
      <DocumentAccessError
        type={accessError?.type}
        message={accessError?.message}
      />
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {contextHolder}

      {/* Document Side - cố định bên trái như sidebar */}
      <DocumentSide document={document} />

      {/* Main content - có thể scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
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
