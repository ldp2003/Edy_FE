import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Modal, Avatar, Button } from "antd";
import { Edit, Share } from "lucide-react";
import PersonalPostHeader from "../../../components/user/personalPosts/PersonalPostHeader";
import DocumentSide from "../../../components/user/document/documentDetail/DocumentSide";
import DocumentActions from "../../../components/user/document/documentDetail/DocumentActions";
import DocumentViewer from "../../../components/user/document/documentView/DocumentViewer";
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

  // Fetch document data - ownership verification is handled at route level
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
        navigate("/personal-posts", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, messageApi, navigate]);

  // Handle page change from document viewer
  const handlePageChange = useCallback((current: number) => {
    setCurrentPage(current);
  }, []);

  // Handle page update from scroll
  const handlePageUpdate = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

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
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center md:text-left">
            Không tìm thấy tài liệu
          </h1>
          <p className="text-gray-600 mb-6">
            Tài liệu bạn đang tìm kiếm không tồn tại hoặc bạn không có quyền
            truy cập.
          </p>
          <button
            onClick={() => navigate("/personal-posts")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Quay lại danh sách tài liệu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {contextHolder}

      {/* Document Side - ẩn trên mobile và tablet, hiện trên desktop */}
      <div className="hidden lg:block lg:w-80">
        <DocumentSide document={document} isUser={true} />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <Avatar
              size={40}
              src={document.user.avatar}
              alt={document.user.first_name}
              className="mr-3"
            >
              {document.user.first_name?.[0] || "U"}
            </Avatar>
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-900 line-clamp-1">
                {document.user.first_name} {document.user.last_name}
              </h2>
              <p className="text-xs text-gray-500">
                {document.organization?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="text"
                size="small"
                icon={<Edit size={16} />}
                onClick={handleEdit}
                className="text-gray-600 hover:text-blue-600"
              />
              <Button
                type="text"
                size="small"
                icon={<Share size={16} />}
                onClick={handleShare}
                className="text-gray-600 hover:text-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content - có thể scroll */}
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="p-2 lg:p-4">
          <div className="hidden lg:flex flex-col">
            <PersonalPostHeader
              document={document}
              onEdit={handleEdit}
              onChangeVisibility={handleChangeVisibility}
              onShare={handleShare}
            />

            {/* Document Actions with isUser flag to disable description modal */}
            <DocumentActions document={document} isUser={true} />
          </div>

          {/* Document Viewer */}
          <DocumentViewer
            url={document.url}
            type={getViewerFileType(document.file_type)}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            onPageUpdate={handlePageUpdate}
            isUser={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalPostDetail;
