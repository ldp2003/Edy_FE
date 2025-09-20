import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import DocumentReview from "../../../components/admin/document/DocumentReview";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";

const DocumentReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) {
        message.error("ID tài liệu không hợp lệ!");
        navigate("/admin/documents");
        return;
      }

      try {
        setLoading(true);
        const documentData = await DocumentService.getDocumentById(id);
        setDocument(documentData);
      } catch (error) {
        console.error("Error fetching document:", error);
        message.error("Không thể tải thông tin tài liệu!");
        navigate("/admin/documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id, navigate]);

  const handleApprove = async (documentId: string) => {
    try {
      // TODO: Implement approve API call
      // await DocumentService.approveDocument(documentId);
      console.log("Approving document:", documentId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to admin documents list
      navigate("/admin/documents");
    } catch (error) {
      console.error("Error approving document:", error);
      throw error;
    }
  };

  const handleReject = async (documentId: string, reason?: string) => {
    try {
      // TODO: Implement reject API call
      // await DocumentService.rejectDocument(documentId, reason);
      console.log("Rejecting document:", documentId, "Reason:", reason);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to admin documents list
      navigate("/admin/documents");
    } catch (error) {
      console.error("Error rejecting document:", error);
      throw error;
    }
  };

  const handleRequestEdit = async (documentId: string, reason?: string) => {
    try {
      // TODO: Implement request edit API call
      // await DocumentService.requestEditDocument(documentId, reason);
      console.log(
        "Requesting edit for document:",
        documentId,
        "Reason:",
        reason
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to admin documents list
      navigate("/admin/documents");
    } catch (error) {
      console.error("Error requesting edit for document:", error);
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
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestEdit={handleRequestEdit}
      />
    </div>
  );
};

export default DocumentReviewPage;
