import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { message, Spin } from "antd";
import DocumentReview from "../../../components/admin/document/DocumentReview";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";

const DocumentReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("requestId");
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        message.error("ID tài liệu không hợp lệ!");
        navigate("/admin/documents/all");
        return;
      }

      try {
        setLoading(true);
        const documentData = await DocumentService.getDocumentById(id);
        setDocument(documentData);
      } catch (error) {
        console.error("Error fetching document:", error);
        message.error("Không thể tải thông tin tài liệu!");
        navigate("/admin/documents/all");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, navigate]);

  const handleApprove = async (reqId?: string) => {
    const targetRequestId = reqId || requestId;
    if (!targetRequestId) {
      message.error("Không có thông tin yêu cầu duyệt!");
      return;
    }

    try {
      await DocumentService.approveDocumentByRequestId(targetRequestId);
      // Message will be shown by child component, delay navigation
      setTimeout(() => {
        navigate("/admin/documents/all");
      }, 2000);
    } catch (error) {
      console.error("Error approving document:", error);
      message.error("Có lỗi xảy ra khi duyệt tài liệu!");
    }
  };

  const handleReject = async (reason: string, reqId?: string) => {
    const targetRequestId = reqId || requestId;
    if (!targetRequestId) {
      message.error("Không có thông tin yêu cầu duyệt!");
      return;
    }

    try {
      await DocumentService.rejectDocumentByRequestId(targetRequestId, reason);
      // Message will be shown by child component, delay navigation
      setTimeout(() => {
        navigate("/admin/documents/all");
      }, 2000);
    } catch (error) {
      console.error("Error rejecting document:", error);
      message.error("Có lỗi xảy ra khi từ chối tài liệu!");
      throw error;
    }
  };

  const handleDelete = async (reason: string) => {
    try {
      await DocumentService.deleteDocument(id!, reason);
      // Message will be shown by child component, delay navigation
      setTimeout(() => {
        navigate("/admin/documents/all");
      }, 2000);
    } catch (error) {
      console.error("Error deleting document:", error);
      message.error("Có lỗi xảy ra khi xóa tài liệu!");
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Không tìm thấy tài liệu
          </h2>
          <p className="text-gray-500">
            Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <DocumentReview
        document={document}
        requestId={requestId || undefined}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DocumentReviewPage;
