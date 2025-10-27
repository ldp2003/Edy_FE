import React, { useState, useEffect } from "react";
import { Form, message, Alert, Input } from "antd";
import type { Document, PendingRequest } from "../../../models/document";
import type { User } from "../../../models/user";
import UserInfoHeader from "./UserInfoHeader";
import type { UserInfo } from "./UserInfoHeader";
import { DocumentService } from "../../../utils/DocumentService";
import DocumentPreview from "./review/DocumentPreview";
import DocumentBasicInfo from "./review/DocumentBasicInfo";
import DocumentAdditionalInfo from "./review/DocumentAdditionalInfo";
import DocumentActionButtons from "./review/DocumentActionButtons";
import DocumentViewModal from "./review/DocumentViewModal";

// Removed unused imports

// Helper function to convert User to UserInfo
const convertUserToUserInfo = (user: User): UserInfo => {
  if (!user) {
    return {
      _id: "",
      first_name: "",
      last_name: "",
      organization: undefined,
      avatar: undefined,
      follower: [],
      following: [],
      doc_count: 0,
    };
  }

  let organizationInfo: { _id: string; name: string } | undefined;

  if (user.organization) {
    if (typeof user.organization === "string") {
      // If organization is a string (ID), we can't get the name, so set undefined
      organizationInfo = undefined;
    } else {
      // If organization is an object, extract _id and name
      organizationInfo = {
        _id: user.organization._id || "",
        name: user.organization.name || "",
      };
    }
  }

  return {
    _id: user._id || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    organization: organizationInfo,
    avatar: user.avatar,
    follower: user.follower || [],
    following: user.following || [],
    doc_count: user.doc_count || 0,
  };
};

// Using PendingRequest from document model

interface DocumentReviewProps {
  document: Document;
  onApprove: (approvalData: {
    documentRequestId: string;
    isIntensive: boolean;
  }) => void;
  onReject: (reason: string, requestId?: string) => void;
  onDelete: (reason: string) => void;
  isEdit?: boolean;
  editData?: any;
  editApprovalData?: any;
}

const DocumentReview: React.FC<DocumentReviewProps> = ({
  document,
  onApprove,
  onReject,
  onDelete,
  isEdit = false,
  editData, // TODO: Use this to show edit changes in UI
  editApprovalData,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [authors, setAuthors] = useState<string[]>([]);
  const [documentViewModalVisible, setDocumentViewModalVisible] =
    useState(false);
  const [processing] = useState(false);
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
            message: editApprovalData.message || '',
            reviewed_by: editApprovalData.reviewed_by,
            reviewed_at: editApprovalData.reviewed_at,
            createdAt: editApprovalData.createdAt,
            updatedAt: editApprovalData.updatedAt,
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
  }, [document._id, messageApi, isEdit, editApprovalData]);

  useEffect(() => {
    if (document) {
      // If this is an edit request, use edit data, otherwise use original document
      const dataToUse = isEdit && editData ? editData : document;
      
      const documentAuthors = dataToUse.author || [""];
      setAuthors(documentAuthors.length > 0 ? documentAuthors : [""]);

      form.setFieldsValue({
        documentName: dataToUse.title,
        subject: typeof dataToUse.subject === 'object' ? dataToUse.subject?.name : '',
        organization: typeof dataToUse.organization === 'object' ? dataToUse.organization?.name : '',
        documentType: dataToUse.doc_type,
        pageCount: dataToUse.page,
        level: dataToUse.level,
        keywords: dataToUse.keyword?.join(", ") || "",
        publisher: dataToUse.publisher || "",
        publishYear: dataToUse.published_year?.toString() || "",
        authors: documentAuthors,
        summary: dataToUse.summary_by_user || dataToUse.description?.summary_by_user || "",
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
      {document.user && (
        <UserInfoHeader user={convertUserToUserInfo(document.user)} />
      )}

      <div className="font-bold text-base mb-4 sm:mb-6 text-[var(--primary-text-color)]">
        Thông tin tài liệu
        <span className="ml-3 text-xs text-black font-medium">
          Id: {document._id}
        </span>
      </div>

      {/* Show edit information alert */}
      {isEdit && editData && (
        <Alert
          message="Chỉnh sửa tài liệu"
          description={
            <div>
              <p className="mb-2">Tài liệu này có yêu cầu chỉnh sửa đang chờ duyệt.</p>
              <p className="text-sm text-gray-600">
                Thông tin bên dưới đang hiển thị dữ liệu đã chỉnh sửa. 
                Khi duyệt, dữ liệu này sẽ thay thế dữ liệu cũ.
              </p>
            </div>
          }
          type="info"
          showIcon
          className="mb-4"
          closable
        />
      )}

      <div className="mx-auto bg-white rounded-lg shadow-sm p-3 sm:p-6">
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
              processing={processing}
              documentId={document._id}
              documentStatus={document.status}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
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
