import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  message,
  Modal,
  Checkbox,
  Radio,
} from "antd";

import { Plus, Minus, Eye } from "lucide-react";
import type { Document } from "../../../models/document";
import type { User } from "../../../models/user";
import UserInfoHeader from "./UserInfoHeader";
import type { UserInfo } from "./UserInfoHeader";
import { DocumentAPI } from "../../../api/API";

const { TextArea } = Input;
const { Option } = Select;

// Helper function to convert User to UserInfo
const convertUserToUserInfo = (user: User): UserInfo => {
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
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    organization: organizationInfo,
    avatar: user.avatar,
    follower: user.follower,
    following: user.following,
    doc_count: user.doc_count,
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
    summaryAction?: 'approve' | 'reject';
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
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [documentViewModalVisible, setDocumentViewModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [isIntensive, setIsIntensive] = useState(false);

  // New states for handling requests
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [documentRequest, setDocumentRequest] = useState<PendingRequest | null>(null);
  const [summaryRequest, setSummaryRequest] = useState<PendingRequest | null>(null);
  const [summaryAction, setSummaryAction] = useState<'approve' | 'reject'>('approve');
  const [summaryRejectReason, setSummaryRejectReason] = useState("");
  const [loading, setLoading] = useState(true);

  // Load pending requests for the document
  useEffect(() => {
    const loadPendingRequests = async () => {
      try {
        setLoading(true);
        const response = await DocumentAPI.getPendingRequests(document._id);
        const requests = response.requests || [];

        setPendingRequests(requests);

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getPreviewImage = () => {
    if (document?.cover_page) {
      return document.cover_page;
    }

    if (document?.url) {
      if (document.file_type === "PDF") {
        return document.url.replace(
          "/upload/",
          "/upload/c_thumb,w_300,h_400,f_jpg/"
        );
      }
      return document.url;
    }

    return "https://cdn-icons-png.flaticon.com/512/2425/2425541.png";
  };

  const getDocumentViewerUrl = () => {
    if (!document?.url) return null;

    // For PDF files, we can use Cloudinary's built-in PDF viewer or embed directly
    if (document.file_type === "PDF") {
      return document.url;
    }

    // For Word documents, convert to viewable format
    if (document.file_type === "WORD") {
      // Option 1: Use Cloudinary's document conversion
      // return document.url.replace(
      //   "/upload/",
      //   "/upload/f_auto,q_auto/"
      // );

      // Option 2: Use Google Docs Viewer (alternative)
      return `https://docs.google.com/viewer?url=${encodeURIComponent(
        document.url
      )}&embedded=true`;
    }

    return document.url;
  };

  const handleOpenDocumentViewer = () => {
    const viewerUrl = getDocumentViewerUrl();
    if (viewerUrl) {
      setDocumentViewModalVisible(true);
    } else {
      messageApi.error("Không thể xem tài liệu này!");
    }
  };

  const handleApprove = async () => {
    if (!documentRequest) {
      messageApi.error("Không tìm thấy request tài liệu!");
      return;
    }

    // Validate summary rejection reason if needed
    if (summaryRequest && summaryAction === 'reject' && !summaryRejectReason.trim()) {
      messageApi.error("Vui lòng nhập lý do từ chối tóm tắt!");
      return;
    }

    setProcessing(true);
    try {
      const approvalData = {
        documentRequestId: documentRequest._id,
        summaryRequestId: summaryRequest?._id,
        isIntensive,
        summaryAction: summaryRequest ? summaryAction : undefined,
        summaryRejectReason: summaryAction === 'reject' ? summaryRejectReason : undefined,
      };

      await onApprove(approvalData);
      messageApi.success("Tài liệu đã được duyệt thành công!");
    } catch (error) {
      console.error("Approve error:", error);
      messageApi.error("Có lỗi xảy ra khi duyệt tài liệu!");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!documentRequest) {
      messageApi.error("Không tìm thấy request tài liệu!");
      return;
    }

    if (!rejectReason.trim()) {
      messageApi.error("Vui lòng nhập lý do từ chối!");
      return;
    }

    setProcessing(true);
    try {
      await onReject(rejectReason, documentRequest._id);
      messageApi.success("Tài liệu đã được từ chối!");
      setRejectModalVisible(false);
      setRejectReason("");
    } catch (error) {
      console.error("Reject error:", error);
      messageApi.error("Có lỗi xảy ra khi từ chối tài liệu!");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      messageApi.error("Vui lòng nhập lý do xóa bài!");
      return;
    }

    setProcessing(true);
    try {
      await onDelete(deleteReason);
      messageApi.success("Tài liệu đã được xóa!");
      setDeleteModalVisible(false);
      setDeleteReason("");
      // Chờ 2 giây trước khi chuyển trang
      setTimeout(() => {
        // Navigation will be handled by parent component
      }, 2000);
    } catch (error) {
      console.error("Delete error:", error);
      messageApi.error("Có lỗi xảy ra khi xóa tài liệu!");
    } finally {
      setProcessing(false);
    }
  };

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

  // Calculate estimated file size (placeholder since we don't have actual size)
  const estimatedFileSize = 1024 * 1024; // 1MB placeholder

  return (
    <div className="py-6 min-h-screen text-left">
      {contextHolder}
      {/* User Info Header */}
      <UserInfoHeader user={convertUserToUserInfo(document.user)} />

      <div className="font-bold text-base mb-6 text-[var(--primary-text-color)]">
        Thông tin tài liệu
        <span className="ml-3 text-xs text-black font-medium">
          Id: {document._id}
        </span>
        {/* Show request info */}
        {/* {documentRequest && (
          <div className="text-xs text-gray-600 mt-2">
            Request ID: {documentRequest._id}
            {summaryRequest && (
              <span className="ml-4">Summary Request ID: {summaryRequest._id}</span>
            )}
          </div>
        )} */}
      </div>

      <div className="mx-auto bg-white rounded-lg shadow-sm p-6">
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            public_mode: "PUBLIC",
            saveData: false,
            authors: authors,
          }}
        >
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: "290px 1fr 1fr" }}
          >
            {/* Column 1 - Image and privacy */}
            <div className="space-y-4">
              <div className="mb-0 relative group">
                <img
                  src={getPreviewImage()}
                  alt="Document preview"
                  className="border border-gray-200 rounded object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ maxHeight: "300px", width: "100%" }}
                  onClick={handleOpenDocumentViewer}
                />
                {/* Overlay with view icon */}
                <div
                  className="absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center cursor-pointer rounded opacity-0 group-hover:opacity-100"
                  onClick={handleOpenDocumentViewer}
                >
                  <Eye size={32} className="text-white" />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatFileSize(estimatedFileSize)}
                  <span
                    className="ml-2 text-blue-600 cursor-pointer hover:underline"
                    onClick={handleOpenDocumentViewer}
                  >
                    Xem tài liệu
                  </span>
                </div>
              </div>

              <Form.Item
                style={{ marginBottom: 5 }}
                name="public_mode"
                label={<span className="text-xs">Chế độ công khai</span>}
              >
                <Select disabled>
                  <Option value="PUBLIC">Công khai</Option>
                  <Option value="PRIVATE">Riêng tư</Option>
                </Select>
              </Form.Item>

              <div className="mt-3">
                <div
                  className={`p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${isIntensive
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 shadow-sm'
                      : 'bg-gray-50 border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                    }`}
                  onClick={() => setIsIntensive(!isIntensive)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`relative flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 ${isIntensive
                        ? 'bg-purple-600 border-purple-600'
                        : 'bg-white border-gray-300'
                      }`}>
                      {isIntensive && (
                        <svg
                          className="w-3 h-3 text-white animate-in fade-in duration-200"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium transition-colors ${isIntensive ? 'text-purple-800' : 'text-gray-700'
                        }`}>
                        🎓 Tài liệu chuyên sâu
                      </span>
                      {isIntensive && (
                        <span className="px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full animate-in fade-in duration-300">
                          Đã chọn
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`mt-2 text-xs transition-colors ${isIntensive ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                    {isIntensive
                      ? 'Tài liệu này sẽ được đánh dấu là chuyên sâu và có thể yêu cầu điểm cao hơn để tải xuống'
                      : 'Đánh dấu tài liệu này là nội dung chuyên sâu nếu nó có chất lượng cao và chi tiết hơn'}
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 - Main form fields */}
            <div className="space-y-4">
              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="documentName"
                label={<span className="text-xs">Tên tài liệu</span>}
              >
                <Input placeholder="Nhập tên tài liệu" disabled />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="subject"
                label={<span className="text-xs">Môn học</span>}
              >
                <Input placeholder="Nhập môn học" disabled />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="organization"
                label={<span className="text-xs">Tổ chức</span>}
              >
                <Input placeholder="Tổ chức" disabled />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: 13.5 }}
                name="documentType"
                label={<span className="text-xs">Loại tài liệu</span>}
              >
                <Select placeholder="Loại tài liệu" disabled>
                  <Option value="RESEARCH_REPORT">
                    Báo cáo nghiên cứu khoa học
                  </Option>
                  <Option value="VIDEO">Video</Option>
                  <Option value="STUDY_GUIDE">Đề cương ôn tập</Option>
                  <Option value="TEXTBOOK">Giáo trình</Option>
                  <Option value="ESSAY">Tiểu luận</Option>
                  <Option value="SOLUTION_SET">Bài giải</Option>
                  <Option value="THESIS">Luận văn / Khóa luận</Option>
                  <Option value="LECTURE">Bài giảng</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>

              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  style={{ marginBottom: 13.5 }}
                  name="pageCount"
                  label={<span className="text-xs">Số trang</span>}
                >
                  <InputNumber
                    min={1}
                    className="w-full"
                    placeholder="Số trang"
                    style={{ width: "100%" }}
                    disabled
                  />
                </Form.Item>

                <Form.Item
                  style={{ marginBottom: 13.5 }}
                  name="level"
                  label={<span className="text-xs">Trình độ</span>}
                >
                  <Select placeholder="Chọn trình độ" disabled>
                    <Option value="STUDENT">Học sinh</Option>
                    <Option value="UNIVERSITY">Sinh viên (ĐH/CĐ)</Option>
                    <Option value="LECTURER">Giảng viên</Option>
                    <Option value="RESEARCHER">Nghiên cứu sinh</Option>
                    <Option value="OTHER">Khác</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>

            {/* Column 3 - Summary */}
            <div>
              <Form.Item
                style={{ marginBottom: 5 }}
                name="summary"
                label={<span className="text-xs">Tóm tắt</span>}
              >
                <TextArea
                  placeholder="Nhập mô tả hoặc tóm tắt tài liệu vào đây"
                  rows={15}
                  style={{ resize: "none", borderColor: "#60a5fa" }}
                  disabled
                />
              </Form.Item>

              {/* Summary approval section - only show if there's a summary request */}
              {summaryRequest && (
                <div className="mt-4 border border-blue-200 rounded-xl overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                    <div className="flex items-center text-white">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm font-semibold">Tóm tắt cần duyệt</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-white p-4 space-y-4">
                    <Radio.Group
                      value={summaryAction}
                      onChange={(e) => {
                        setSummaryAction(e.target.value);
                        if (e.target.value === 'approve') {
                          setSummaryRejectReason("");
                        }
                      }}
                      className="w-full"
                    >
                      <div className="grid gap-3">
                        {/* Approve Option - Expanded clickable area */}
                        <label
                          className="flex items-center p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-all cursor-pointer w-full"
                          htmlFor="approve-radio"
                        >
                          <Radio
                            id="approve-radio"
                            value="approve"
                            className="text-sm pointer-events-none"
                          >
                            <span className="flex items-center font-medium text-green-700 pointer-events-none">
                              ✅ Duyệt tóm tắt
                            </span>
                          </Radio>
                        </label>

                        {/* Reject Option - Expanded clickable area */}
                        <label
                          className="flex items-center p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-all cursor-pointer w-full"
                          htmlFor="reject-radio"
                        >
                          <Radio
                            id="reject-radio"
                            value="reject"
                            className="text-sm pointer-events-none"
                          >
                            <span className="flex items-center font-medium text-red-700 pointer-events-none">
                              ❌ Từ chối tóm tắt
                            </span>
                          </Radio>
                        </label>
                      </div>
                    </Radio.Group>

                    {/* Rejection reason */}
                    {summaryAction === 'reject' && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <label className="block text-sm font-semibold text-red-800 mb-2">
                          📝 Lý do từ chối:
                        </label>
                        <TextArea
                          rows={3}
                          value={summaryRejectReason}
                          onChange={(e) => setSummaryRejectReason(e.target.value)}
                          placeholder="Vui lòng nhập lý do cụ thể..."
                          style={{ resize: "none" }}
                          className="border-red-300 focus:border-red-400 focus:ring-red-200"
                        />
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="flex justify-end mt-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${summaryAction === 'approve'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        {summaryAction === 'approve' ? 'Sẽ được duyệt' : 'Sẽ bị từ chối'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Thông tin khác */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="font-semibold text-base mb-4 text-gray-800">
              Thông tin khác
            </div>
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: "290px 1fr 1fr" }}
            >
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="publisher"
                    label="Nhà xuất bản"
                  >
                    <Input placeholder="Nhà xuất bản" disabled />
                  </Form.Item>

                  <Form.Item
                    style={{ marginBottom: 5 }}
                    name="publishYear"
                    label="Năm xuất bản"
                  >
                    <Input placeholder="Năm xuất bản" disabled />
                  </Form.Item>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tác giả tài liệu
                  </label>
                  {authors.map((author, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-2">
                      <Input
                        value={author}
                        placeholder="Tác giả tài liệu"
                        className="flex-1"
                        disabled
                      />
                      <Button
                        type="text"
                        icon={<Minus size={16} />}
                        className="p-2"
                        disabled
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    icon={<Plus size={16} />}
                    className="w-12 h-10"
                    disabled
                  />
                </div>
              </div>

              <div>
                <Form.Item
                  style={{ marginBottom: 5 }}
                  name="keywords"
                  label={<span className="text-xs">Từ khóa</span>}
                >
                  <TextArea
                    placeholder="Nhập các từ khóa liên quan đến tài liệu vào đây (phân cách bằng dấu phẩy)"
                    rows={5}
                    style={{ resize: "none" }}
                    disabled
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* Action buttons - THAY ĐỔI CHÍNH Ở ĐÂY */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <Button
                style={{
                  backgroundColor: "#22c55e",
                  borderColor: "#22c55e",
                  color: "white",
                }}
                onClick={handleApprove}
                loading={processing}
                disabled={processing}
              >
                Duyệt bài
              </Button>
              <Button
                style={{
                  backgroundColor: "#ef4444",
                  borderColor: "#ef4444",
                  color: "white",
                }}
                onClick={() => setRejectModalVisible(true)}
                disabled={processing}
              >
                Từ chối
              </Button>
              <Button
                style={{
                  backgroundColor: "#f59e0b",
                  borderColor: "#f59e0b",
                  color: "white",
                }}
                onClick={() => setDeleteModalVisible(true)}
                disabled={processing}
              >
                Xóa bài
              </Button>
            </div>
          </div>
        </Form>
      </div>

      {/* Document Viewer Modal */}
      <Modal
        title={`Xem tài liệu: ${document.title}`}
        open={documentViewModalVisible}
        onCancel={() => setDocumentViewModalVisible(false)}
        footer={[
          <Button
            key="close"
            onClick={() => setDocumentViewModalVisible(false)}
          >
            Đóng
          </Button>,
        ]}
        width="90vw"
        style={{ maxWidth: "1200px" }}
        bodyStyle={{ padding: 0, height: "80vh" }}
        destroyOnClose={true}
      >
        <div className="w-full h-full">
          {document.file_type === "PDF" ? (
            // For PDF files - direct embed
            <iframe
              src={`${getDocumentViewerUrl()}#toolbar=0&navpanes=1&scrollbar=1`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Document Viewer"
            />
          ) : document.file_type === "WORD" ? (
            // For Word files - use Google Docs Viewer
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                document.url
              )}&embedded=true`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Document Viewer"
            />
          ) : (
            // For other file types
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Không thể xem trước file này
                </p>
                <Button
                  type="primary"
                  onClick={() => window.open(document.url, "_blank")}
                >
                  Mở file trong tab mới
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối tài liệu"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason("");
        }}
        okText="Từ chối"
        cancelText="Hủy"
        confirmLoading={processing}
        okButtonProps={{
          style: {
            backgroundColor: "#ef4444",
            borderColor: "#ef4444",
          },
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lý do từ chối:
          </label>
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Nhập lý do từ chối tài liệu này..."
            style={{ resize: "none" }}
          />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Xóa bài viết"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDeleteReason("");
        }}
        okText="Xóa"
        cancelText="Hủy"
        confirmLoading={processing}
        okButtonProps={{
          style: {
            backgroundColor: "#f59e0b",
            borderColor: "#f59e0b",
          },
        }}
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lý do xóa bài:
          </label>
          <TextArea
            rows={4}
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder="Nhập lý do xóa bài viết này..."
            style={{ resize: "none" }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default DocumentReview;
