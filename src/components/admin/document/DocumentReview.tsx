import React, { useState, useEffect } from "react";
import { Form, Input, Select, InputNumber, Button, message, Modal } from "antd";

import { Plus, Minus, Eye, X } from "lucide-react";
import type { Document } from "../../../models/document";
import UserInfoHeader from "./UserInfoHeader";
import DocumentViewer from "../../user/document/documentView/DocumentViewer";
import DocumentPagination from "../../user/document/documentView/DocumentPagination";

const { TextArea } = Input;
const { Option } = Select;

interface DocumentReviewProps {
  document: Document;
  requestId?: string; // Thêm requestId
  onApprove: (requestId?: string) => void;
  onReject: (reason: string, requestId?: string) => void;
  onDelete: (reason: string) => void;
}

const DocumentReview: React.FC<DocumentReviewProps> = ({
  document,
  requestId,
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

  // Document viewer modal states
  const [documentViewerVisible, setDocumentViewerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1.5);

  // Fill form with document data
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
      return `https://docs.google.com/viewer?url=${encodeURIComponent(document.url)}&embedded=true`;
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
    setProcessing(true);
    try {
      await onApprove(requestId);
      messageApi.success("Tài liệu đã được duyệt thành công!");
      // Chờ 2 giây trước khi chuyển trang
      setTimeout(() => {
        // Navigation will be handled by parent component
      }, 2000);
    } catch (error) {
      console.error("Approve error:", error);
      messageApi.error("Có lỗi xảy ra khi duyệt tài liệu!");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      messageApi.error("Vui lòng nhập lý do từ chối!");
      return;
    }

    setProcessing(true);
    try {
      await onReject(rejectReason, requestId);
      messageApi.success("Tài liệu đã được từ chối!");
      setRejectModalVisible(false);
      setRejectReason("");
      // Chờ 2 giây trước khi chuyển trang
      setTimeout(() => {
        // Navigation will be handled by parent component
      }, 2000);
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

  // Calculate estimated file size (placeholder since we don't have actual size)
  const estimatedFileSize = 1024 * 1024; // 1MB placeholder

  return (
    <div className="py-6 min-h-screen text-left">
      {contextHolder}
      {/* User Info Header */}
      <UserInfoHeader user={document.user} />

      <div className="font-bold text-base mb-6 text-[var(--primary-text-color)]">
        Thông tin tài liệu
        <span className="ml-3 text-xs text-black font-medium">
          Id: {document._id}
        </span>
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
                  <Eye
                    size={32}
                    className="text-white"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatFileSize(estimatedFileSize)}
                  <span className="ml-2 text-blue-600 cursor-pointer hover:underline" onClick={handleOpenDocumentViewer}>
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
          <Button key="close" onClick={() => setDocumentViewModalVisible(false)}>
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
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(document.url)}&embedded=true`}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Document Viewer"
            />
          ) : (
            // For other file types
            <div className="flex items-center justify-center h-full bg-gray-100">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Không thể xem trước file này</p>
                <Button
                  type="primary"
                  onClick={() => window.open(document.url, '_blank')}
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
