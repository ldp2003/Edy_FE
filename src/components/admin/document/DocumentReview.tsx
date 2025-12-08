/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, type JSX } from "react";
import { Form, message, Alert, Input } from "antd";
import type { Document, PendingRequest } from "../../../models/document";
import UserInfoHeader from "./UserInfoHeader";
import { DocumentService } from "../../../utils/DocumentService";
import DocumentPreview from "./review/DocumentPreview";
import DocumentBasicInfo from "./review/DocumentBasicInfo";
import DocumentAdditionalInfo from "./review/DocumentAdditionalInfo";
import DocumentActionButtons from "./review/DocumentActionButtons";
import DocumentViewModal from "./review/DocumentViewModal";

// Removed unused imports

// Using PendingRequest from document model

// Helper function to convert AI violation level to Vietnamese text
const getViolationLevelText = (level: string): string | JSX.Element => {
  switch (level) {
    case "LOW":
      return "Thấp";
    case "MEDIUM":
      return <span className="font-bold">Trung bình</span>;
    case "HIGH":
      return <span className="font-bold text-red-500">Cao</span>;
    default:
      return level;
  }
};

// Helper function to convert AI action suggestion to Vietnamese text
const getActionSuggestText = (action: string): string => {
  switch (action) {
    case "AUTO_APPROVE":
      return "Duyệt tự động";
    case "REJECT":
      return "Từ chối";
    case "MANUAL_REVIEW":
      return "Xem xét thủ công";
    default:
      return action;
  }
};

interface DocumentReviewProps {
  document: Document;
  isEdit?: boolean;
  editData?: any;
  editApprovalData?: any;
}

const DocumentReview: React.FC<DocumentReviewProps> = ({
  document,
  isEdit = false,
  editData,
  editApprovalData,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [authors, setAuthors] = useState<string[]>([]);
  const [documentViewModalVisible, setDocumentViewModalVisible] =
    useState(false);
  const [isIntensive, setIsIntensive] = useState(false);

  // New states for handling requests
  const [documentRequest, setDocumentRequest] = useState<PendingRequest | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Load pending requests for the document (only for new uploads, not edit requests)
  useEffect(() => {
    const loadPendingRequests = async () => {
      try {
        setLoading(true);

        // For edit requests, use the provided edit approval data
        if (isEdit && editApprovalData) {
          setDocumentRequest({
            _id: editApprovalData._id,
            doc: document._id,
            status: editApprovalData.status,
            message: editApprovalData.message || "",
            reviewed_by: editApprovalData.reviewed_by,
            reviewed_at: editApprovalData.reviewed_at,
            createdAt: editApprovalData.createdAt,
            updatedAt: editApprovalData.updatedAt,
            ai_checked: editApprovalData.ai_checked || false,
            ai_violation_level: editApprovalData.ai_violation_level || "",
            ai_action_suggest: editApprovalData.ai_action_suggest || "",
            ai_reason: editApprovalData.ai_reason || "",
          });
        } else {
          // For new upload requests, fetch from API
          const response = await DocumentService.getPendingRequestsByDocument(
            document._id
          );
          const requests = response.requests || [];

          // Get the first request (should only be one)
          const docReq = requests[0] || null;

          setDocumentRequest(docReq || null);
        }

        console.log("Loaded requests:", { documentRequest });
      } catch (error) {
        console.error("Error loading pending requests:", error);
        messageApi.error("Không thể tải thông tin requests!");
      } finally {
        setLoading(false);
      }
    };

    if (document._id) {
      loadPendingRequests();
    }
  }, [document._id, messageApi, isEdit, editApprovalData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (document) {
      // If this is an edit request, use edit data, otherwise use original document
      const dataToUse = isEdit && editData ? editData : document;

      const documentAuthors = dataToUse.author || [""];
      setAuthors(documentAuthors.length > 0 ? documentAuthors : [""]);

      form.setFieldsValue({
        documentName: dataToUse.title,
        subject:
          typeof dataToUse.subject === "object" ? dataToUse.subject?.name : "",
        organization:
          typeof dataToUse.organization === "object"
            ? dataToUse.organization?.name
            : "",
        documentType: dataToUse.doc_type,
        pageCount: dataToUse.page,
        level: dataToUse.level,
        keywords: dataToUse.keyword?.join(", ") || "",
        publisher: dataToUse.publisher || "",
        publishYear: dataToUse.published_year?.toString() || "",
        authors: documentAuthors,
        summary:
          dataToUse.summary_by_user ||
          dataToUse.description?.summary_by_user ||
          "",
        public_mode: dataToUse.public_mode || document.public_mode || "PUBLIC",
      });
    }
  }, [document, form, isEdit, editData]);

  // Functions moved to child components

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4 sm:pb-6 min-h-screen text-left">
      {contextHolder}

      {/* User Info Header */}
      {document.user && <UserInfoHeader user={document.user} />}

      <div className="font-bold text-base mb-4 sm:mb-6 text-[var(--primary-text-color)]">
        Thông tin tài liệu
        <span className="ml-3 text-xs text-black font-medium">
          Id: {document._id}
        </span>
      </div>

      {/* Show AI check information alert */}
      {documentRequest && documentRequest.ai_checked && (
        <Alert
          message="Kết quả kiểm tra từ AI"
          description={
            <div>
              <p className="mb-1">
                <strong>Mức độ vi phạm:</strong>{" "}
                {getViolationLevelText(documentRequest.ai_violation_level)}
              </p>
              <p className="mb-1">
                <strong>Hành động đề xuất:</strong>{" "}
                {getActionSuggestText(documentRequest.ai_action_suggest)}
              </p>
              {documentRequest.ai_reason && (
                <p>
                  <strong>Lý do:</strong> {documentRequest.ai_reason}
                </p>
              )}
            </div>
          }
          type="warning"
          showIcon
          className="mb-4"
          closable
        />
      )}

      {documentRequest && !documentRequest.ai_checked && (
        <Alert
          message="AI vẫn đang trong quá trình kiểm tra tài liệu này, trong thời gian đó, bạn có thể xem thông tin tài liệu và kiểm duyệt thủ công"
          type="warning"
          showIcon
          className="mb-4"
          closable
        />
      )}

      {/* Show edit information alert */}
      {isEdit && editData && (
        <Alert
          message="Chỉnh sửa tài liệu"
          description={
            <div>
              <p className="mb-2">
                Tài liệu này có yêu cầu chỉnh sửa đang chờ duyệt.
              </p>
              <p className="text-sm text-gray-600">
                Thông tin bên dưới đang hiển thị dữ liệu đã chỉnh sửa. Khi
                duyệt, dữ liệu này sẽ thay thế dữ liệu cũ.
              </p>
            </div>
          }
          type="info"
          showIcon
          className="mb-4"
          closable
        />
      )}

      {/* Show deletion information alert */}
      {document.is_deleted && (
        <Alert
          message="Tài liệu đã bị xóa"
          description={
            <div>
              <p className="mb-2">
                Tài liệu này đã bị xóa khỏi hệ thống và sẽ không thể khôi phục
                sau
                <b>
                  {document.expiredAt
                    ? ` ${new Date(document.expiredAt).toLocaleString("vi-VN")}`
                    : ""}
                  .
                </b>
              </p>
              {document.is_delete_by_admin && (
                <div className="text-sm text-gray-600">
                  <p className="mb-1">
                    <strong>Được xóa bởi:</strong> Admin
                  </p>
                  {document.delete_by_admin_reason && (
                    <p className="mb-1">
                      <strong>Lý do:</strong> {document.delete_by_admin_reason}
                    </p>
                  )}
                  {document.delete_by_admin_at && (
                    <p>
                      <strong>Thời gian xóa:</strong>{" "}
                      {new Date(document.delete_by_admin_at).toLocaleString(
                        "vi-VN"
                      )}
                    </p>
                  )}
                </div>
              )}
              {!document.is_delete_by_admin && (
                <p className="text-sm text-gray-600">
                  Tài liệu được xóa bởi chính chủ sở hữu.
                </p>
              )}
            </div>
          }
          type="error"
          showIcon
          className="mb-4"
          closable
        />
      )}

      <div className="mx-auto bg-white rounded-lg shadow-sm my-3 p-3 sm:p-6">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            public_mode: "PUBLIC",
            saveData: false,
            authors: authors,
          }}
        >
          {/* Responsive Grid Layout */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3 xl:grid-cols-3">
            {/* Column 1 - Document Preview */}
            <div className="lg:col-span-1 xl:col-span-1">
              <DocumentPreview
                document={document}
                isIntensive={isIntensive}
                onIntensiveChange={setIsIntensive}
                onViewDocument={() => setDocumentViewModalVisible(true)}
              />
            </div>

            {/* Column 2 - Basic Information */}
            <div className="lg:col-span-1 xl:col-span-1">
              <DocumentBasicInfo />
            </div>

            {/* Column 3 - Summary */}
            <div className="lg:col-span-1 xl:col-span-1">
              <Form.Item
                style={{ marginBottom: 5 }}
                name="summary"
                label={<span className="text-xs">Tóm tắt</span>}
              >
                <Input.TextArea
                  placeholder="Tài liệu này không có tóm tắt"
                  rows={15}
                  style={{ resize: "none", borderColor: "#60a5fa" }}
                  disabled
                  readOnly
                />
              </Form.Item>
            </div>
          </div>

          {/* Additional Information - Full Width */}
          <div className="mt-6">
            <DocumentAdditionalInfo
              authors={authors}
              onAuthorsChange={setAuthors}
            />
          </div>

          {/* Action Buttons - Full Width */}
          <div className="mt-6">
            <DocumentActionButtons
              documentRequest={documentRequest}
              isIntensive={isIntensive}
              documentId={document._id}
              documentStatus={document.is_deleted ? "DELETED" : document.status}
              documentType={document.file_type}
            />
          </div>
        </Form>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewModal
        document={document}
        visible={documentViewModalVisible}
        onClose={() => setDocumentViewModalVisible(false)}
      />
    </div>
  );
};

export default DocumentReview;
