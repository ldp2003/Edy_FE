/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { message, Spin, Alert } from "antd";
import DocumentReview from "../../../components/admin/document/DocumentReview";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const DocumentReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [editApprovalData, setEditApprovalData] = useState<any>(null);

  // Get duplicate document info from navigation state
  const duplicateDocument = location.state?.duplicateDocument as
    | {
        duplicateId: string;
        duplicateTitle: string;
      }
    | undefined;

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
        const isEditRequest = documentData.status === "PENDING_EDIT";
        setIsEdit(isEditRequest);

        // If this is an edit request, fetch edit data and approval info
        if (isEditRequest) {
          try {
            // Fetch edit document data
            const editDocData = await DocumentService.getEditDocument(id);
            setEditData(editDocData);

            // Fetch edit approval data
            const editApproval =
              await DocumentService.getEditApprovalByDocumentId(id);
            setEditApprovalData(editApproval);
          } catch (editError: any) {
            console.error("Error fetching edit data:", editError);
            // Don't show error if it's just that there's no edit data yet
            if (editError.response?.status !== 404) {
              message.warning(
                "Không thể tải thông tin chỉnh sửa. Tiếp tục với tài liệu gốc."
              );
            }
          }
        } else {
          // For new upload requests, the approval data is fetched by the DocumentReview component
          setEditData(null);
          setEditApprovalData(null);
        }
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
  const breadcrumbItems = [
    { label: "Admin", path: "/admin" },
    { label: "Quản lý nội dung", path: "/admin/documents/all" },
    { label: "Tài liệu", path: "/admin/documents/all" },
    { label: document.title || "Chi tiết tài liệu" },
  ];

  return (
    <div className="w-full text-left mx-auto px-4 sm:px-6 lg:px-8">
      <AdminBreadcrumb items={breadcrumbItems} />

      {/* Show duplicate document alert if came from compare page */}
      {duplicateDocument && (
        <Alert
          message="Phát hiện tài liệu trùng lặp"
          description={
            <div>
              <p className="mb-2">
                <strong>Tài liệu trùng lặp:</strong>{" "}
                {duplicateDocument.duplicateTitle}
              </p>
              <p className="text-sm text-gray-600">
                <strong>ID:</strong> {duplicateDocument.duplicateId}
              </p>
              <p className="text-sm text-orange-600 mt-2">
                Vui lòng xem xét và xử lý tài liệu này do có nội dung trùng lặp.
              </p>
            </div>
          }
          type="warning"
          showIcon
          className="mb-4"
          closable
        />
      )}

      <DocumentReview
        document={document}
        isEdit={isEdit}
        editData={editData}
        editApprovalData={editApprovalData}
      />
    </div>
  );
};

export default DocumentReviewPage;
