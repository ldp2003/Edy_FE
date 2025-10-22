import React, { useState, useEffect } from "react";
import { Form, message } from "antd";
import type { Document } from "../../../models/document";
import type { User } from "../../../models/user";
import UserInfoHeader from "./UserInfoHeader";
import type { UserInfo } from "./UserInfoHeader";
import { DocumentService } from "../../../utils/DocumentService";
import DocumentPreview from "./review/DocumentPreview";
import DocumentBasicInfo from "./review/DocumentBasicInfo";
import DocumentSummary from "./review/DocumentSummary";
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

interface PendingRequest {
  _id: string;
  doc: string;
  requester: string;
  is_summary: boolean;
  status: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentReviewProps {
  document: Document;
  onApprove: (approvalData: {
    documentRequestId: string;
    summaryRequestId?: string;
    isIntensive: boolean;
    summaryAction?: "approve" | "reject";
    summaryRejectReason?: string;
  }) => void;
  onReject: (reason: string, requestId: string) => void;
  onDelete: (reason: string) => void;
}

const DocumentReview: React.FC<DocumentReviewProps> = ({
  document,
  onApprove,
  onReject,
  onDelete,
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
  const [summaryRequest, setSummaryRequest] = useState<PendingRequest | null>(
    null
  );
  const [summaryAction, setSummaryAction] = useState<"approve" | "reject">(
    "approve"
  );
  const [summaryRejectReason, setSummaryRejectReason] = useState("");
  const [loading, setLoading] = useState(true);

  // Load pending requests for the document
  useEffect(() => {
    const loadPendingRequests = async () => {
      try {
        setLoading(true);
        const response = await DocumentService.getPendingRequestsByDocument(
          document._id
        );
        const requests = response.requests || [];

        // Separate document and summary requests
        const docReq = requests.find((req: PendingRequest) => !req.is_summary);
        const sumReq = requests.find((req: PendingRequest) => req.is_summary);

        setDocumentRequest(docReq || null);
        setSummaryRequest(sumReq || null);

        console.log("Loaded requests:", { docReq, sumReq });
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
  }, [document._id, messageApi]);

  useEffect(() => {
    if (document) {
      const documentAuthors = document.author || [""];
      setAuthors(documentAuthors.length > 0 ? documentAuthors : [""]);

      form.setFieldsValue({
        documentName: document.title,
        subject: document.subject?.name || "",
        organization: document.organization?.name || "",
        documentType: document.doc_type,
        pageCount: document.page,
        level: document.level,
        keywords: document.keyword?.join(", ") || "",
        publisher: document.publisher || "",
        publishYear: document.published_year?.toString() || "",
        authors: documentAuthors,
        summary: document.description?.summary_by_user || "",
        public_mode: document.public_mode || "PUBLIC",
      });
    }
  }, [document, form]);

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
              <DocumentSummary
                summaryRequest={summaryRequest}
                summaryAction={summaryAction}
                summaryRejectReason={summaryRejectReason}
                onSummaryActionChange={setSummaryAction}
                onSummaryRejectReasonChange={setSummaryRejectReason}
              />
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
              summaryRequest={summaryRequest}
              isIntensive={isIntensive}
              summaryAction={summaryAction}
              summaryRejectReason={summaryRejectReason}
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
