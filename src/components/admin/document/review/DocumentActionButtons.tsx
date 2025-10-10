import React, { useState } from "react";
import { Button, Modal, message, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { NotificationService } from "../../../../utils/NotificationService";

const { TextArea } = Input;

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

interface DocumentActionButtonsProps {
  documentRequest: PendingRequest | null;
  summaryRequest: PendingRequest | null;
  isIntensive: boolean;
  summaryAction: "approve" | "reject";
  summaryRejectReason: string;
  processing: boolean;
  documentId: string;
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

const DocumentActionButtons: React.FC<DocumentActionButtonsProps> = ({
  documentRequest,
  summaryRequest,
  isIntensive,
  summaryAction,
  summaryRejectReason,
  processing,
  documentId,
  onApprove,
  onReject,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");

  const handleApprove = async () => {
    if (!documentRequest) {
      messageApi.error("Không tìm thấy request tài liệu!");
      return;
    }

    // Validate summary rejection reason if needed
    if (
      summaryRequest &&
      summaryAction === "reject" &&
      !summaryRejectReason.trim()
    ) {
      messageApi.error("Vui lòng nhập lý do từ chối tóm tắt!");
      return;
    }

    try {
      const approvalData = {
        documentRequestId: documentRequest._id,
        summaryRequestId: summaryRequest?._id,
        isIntensive,
        summaryAction: summaryRequest ? summaryAction : undefined,
        summaryRejectReason:
          summaryAction === "reject" ? summaryRejectReason : undefined,
      };

      await onApprove(approvalData);
      messageApi.success("Tài liệu đã được duyệt thành công!");

      // Send notification to the document owner
      await NotificationService.createNotification({
        userId: documentRequest.requester,
        type: "SYSTEM",
        message: `Tài liệu của bạn đã được duyệt: ${documentRequest.doc}`,
        docId: documentRequest.doc,
      });
    } catch (error) {
      console.error("Approve error:", error);
      messageApi.error("Có lỗi xảy ra khi duyệt tài liệu!");
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

    try {
      await onReject(rejectReason, documentRequest._id);
      messageApi.success("Tài liệu đã được từ chối!");
      setRejectModalVisible(false);
      setRejectReason("");

      // Send notification to the document owner
      await NotificationService.createNotification({
        userId: documentRequest.requester,
        type: "SYSTEM",
        message: `Tài liệu của bạn đã bị từ chối: ${documentRequest.doc}. Lý do: ${rejectReason}`,
        docId: documentRequest.doc,
      });
    } catch (error) {
      console.error("Reject error:", error);
      messageApi.error("Có lỗi xảy ra khi từ chối tài liệu!");
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      messageApi.error("Vui lòng nhập lý do xóa bài!");
      return;
    }

    try {
      await onDelete(deleteReason);
      messageApi.success("Tài liệu đã được xóa!");
      setDeleteModalVisible(false);
      setDeleteReason("");

      // Send notification to the document owner
      await NotificationService.createNotification({
        userId: documentRequest?.requester || "",
        type: "SYSTEM",
        message: `Tài liệu của bạn đã bị xóa: ${documentRequest?.doc}. Lý do: ${deleteReason}`,
        docId: documentRequest?.doc,
      });
    } catch (error) {
      console.error("Delete error:", error);
      messageApi.error("Có lỗi xảy ra khi xóa tài liệu!");
    }
  };

  const handleCompare = () => {
    navigate(`/admin/documents/compare/${documentId}`);
  };

  return (
    <>
      {contextHolder}
      {/* Action buttons */}
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
            Yêu cầu chỉnh sửa
          </Button>
          <Button
            style={{
              backgroundColor: "#8b5cf6",
              borderColor: "#8b5cf6",
              color: "white",
            }}
            onClick={handleCompare}
            disabled={processing}
          >
            Xem trùng
          </Button>
        </div>
      </div>

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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setRejectReason(e.target.value)
            }
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDeleteReason(e.target.value)
            }
            placeholder="Nhập lý do xóa bài viết này..."
            style={{ resize: "none" }}
          />
        </div>
      </Modal>
    </>
  );
};

export default DocumentActionButtons;
