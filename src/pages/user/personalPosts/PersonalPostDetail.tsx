import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message, Modal } from "antd";
import PersonalPostHeader from "../../../components/user/personalPosts/PersonalPostHeader";
import DocumentSide from "../../../components/user/document/documentDetail/DocumentSide";
import DocumentActions from "../../../components/user/document/documentDetail/DocumentActions";
import DocumentViewer from "../../../components/user/document/documentView/DocumentViewer";
import DocumentPagination from "../../../components/user/document/documentView/DocumentPagination";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";

const PersonalPostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  // Header action handlers
  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    navigate(`/personal-posts/edit/${document?._id}`);
  };

  const handleChangeVisibility = async (newMode: string) => {
    if (!document) return;

    const action = newMode === "PUBLIC" ? "công khai" : "riêng tư";

    Modal.confirm({
      title: `Thay đổi chế độ tài liệu`,
      content: `Bạn có chắc chắn muốn đặt tài liệu này thành ${action}?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        // Call API to update visibility
        messageApi.success(`Đã thay đổi tài liệu thành ${action}`);
        // Update local state
        setDocument({
          ...document,
          public_mode: newMode as
            | "PUBLIC"
            | "PRIVATE"
            | "PRIVATE_SHARED"
            | "SHARE_ORGANIZATION",
        });
      },
    });
  };

  const handleShare = () => {
    if (!document) return;

    Modal.info({
      title: "Chia sẻ tài liệu",
      content: (
        <div className="mt-4">
          <p className="mb-3">
            Bạn có thể chia sẻ tài liệu này bằng các cách sau:
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium mb-1">Link trực tiếp:</p>
              <code className="text-sm bg-white px-2 py-1 rounded border">
                {window.location.href}
              </code>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="font-medium mb-1">Chia sẻ trong tổ chức</p>
              <p className="text-sm text-gray-600">
                Đặt chế độ "Chia sẻ tổ chức" để mọi người trong tổ chức có thể
                xem
              </p>
            </div>
          </div>
        </div>
      ),
      width: 600,
      okText: "Đóng",
    });
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
    <div className="h-screen flex overflow-hidden">
      {contextHolder}

      {/* Document Side - cố định bên trái như sidebar */}
      <DocumentSide document={document} isUser={true} />

      {/* Main content - có thể scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <PersonalPostHeader
            document={document}
            onEdit={handleEdit}
            onChangeVisibility={handleChangeVisibility}
            onShare={handleShare}
          />

          {/* Document Actions with isUser flag to disable description modal */}
          <DocumentActions document={document} isUser={true} />

          {/* Document Viewer */}
          <DocumentViewer
            url={document.url}
            type={getViewerFileType(document.file_type)}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            onPageUpdate={handlePageUpdate}
            zoom={zoom}
            isUser={true}
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

export default PersonalPostDetail;
