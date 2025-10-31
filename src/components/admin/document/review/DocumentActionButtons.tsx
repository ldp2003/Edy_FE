import React, { useState, useMemo, useCallback } from "react";
import { Button, Modal, message, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { NotificationService } from "../../../../utils/NotificationService";
import type { PendingRequest } from "../../../../models/document";

const { TextArea } = Input;

interface DocumentActionButtonsProps {
  documentRequest: PendingRequest | null;
  isIntensive: boolean;
  processing: boolean;
  documentId: string;
  documentStatus?: string; // Thêm status của document
  documentType?: string; // Thêm loại tài liệu
  onApprove: (approvalData: {
    documentRequestId: string;
    isIntensive: boolean;
  }) => void;
  onReject: (reason: string, requestId: string) => void;
  onDelete: (reason: string) => void;
}

const DocumentActionButtons: React.FC<DocumentActionButtonsProps> = ({
  documentRequest,
  isIntensive,
  processing,
  documentId,
  documentStatus,
  documentType,
  onApprove,
  onReject,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editRequestModalVisible, setEditRequestModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [editRequestReason, setEditRequestReason] = useState("");

  // Document status constants
  const DOCUMENT_STATUS = {
    PENDING: "PENDING",
    PENDING_EDIT: "PENDING_EDIT",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    REQUESTED_EDIT: "REQUESTED_EDIT",
  } as const;

  type DocumentStatusType =
    (typeof DOCUMENT_STATUS)[keyof typeof DOCUMENT_STATUS];

  const handleApprove = useCallback(async () => {
    if (!documentRequest) {
      messageApi.error("Không tìm thấy request tài liệu!");
      return;
    }

    try {
      const approvalData = {
        documentRequestId: documentRequest._id,
        isIntensive,
      };

      await onApprove(approvalData);
      messageApi.success("Tài liệu đã được duyệt thành công!");

      // Send notification to the document owner
      if (documentRequest.requester) {
        await NotificationService.createNotification({
          userId: documentRequest.requester,
          type: "SYSTEM",
          message: `Quản trị viên đã duyệt tài liệu của bạn.`,
          docId: documentRequest.doc,
        });
      }
    } catch (error) {
      console.error("Approve error:", error);
      messageApi.error("Có lỗi xảy ra khi duyệt tài liệu!");
    }
  }, [documentRequest, isIntensive, onApprove, messageApi]);

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
      if (documentRequest.requester) {
        await NotificationService.createNotification({
          userId: documentRequest.requester,
          type: "SYSTEM",
          message: `Quản trị viên đã từ chối tài liệu của bạn. Lý do: ${rejectReason}`,
          docId: documentRequest.doc,
        });
      }
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
        message: `Quản trị viên đã xóa tài liệu của bạn. Lý do: ${deleteReason}`,
        docId: documentRequest?.doc,
      });
    } catch (error) {
      console.error("Delete error:", error);
      messageApi.error("Có lỗi xảy ra khi xóa tài liệu!");
    }
  };

  const handleEditRequest = async () => {
    if (!editRequestReason.trim()) {
      messageApi.error("Vui lòng nhập lý do yêu cầu chỉnh sửa!");
      return;
    }

    try {
      await onDelete(editRequestReason);
      messageApi.success("Đã gửi yêu cầu chỉnh sửa!");
      setEditRequestModalVisible(false);
      setEditRequestReason("");

      // Send notification to the document owner
      await NotificationService.createNotification({
        userId: documentRequest?.requester || "",
        type: "SYSTEM",
        message: `Quản trị viên yêu cầu chỉnh sửa tài liệu của bạn. Lý do: ${editRequestReason}`,
        docId: documentRequest?.doc,
      });
    } catch (error) {
      console.error("Edit request error:", error);
      messageApi.error("Có lỗi xảy ra khi gửi yêu cầu chỉnh sửa!");
    }
  };

  const handleCompare = () => {
    navigate(`/admin/documents/compare/${documentId}`);
  };

  // Check if document type supports comparison (Word or PDF)
  const canCompare = useMemo(() => {
    if (!documentType) return false;
    const supportedTypes = ["WORD", "PDF"];
    return supportedTypes.includes(documentType.toUpperCase());
  }, [documentType]);

  // Button configurations based on document status
  const statusConfig = useMemo(() => {
    const configs: Record<
      DocumentStatusType,
      {
        statusBadge: {
          text: string;
          color: string;
          bgColor: string;
          borderColor: string;
        } | null;
        actionButtons: Array<{
          key: string;
          text: string;
          color: string;
          onClick: () => void;
          disabled?: boolean;
        }>;
      }
    > = {
      [DOCUMENT_STATUS.PENDING]: {
        statusBadge: {
          text: "⏳ Đang chờ duyệt",
          color: "text-blue-700",
          bgColor: "bg-blue-100",
          borderColor: "border-blue-300",
        },
        actionButtons: [
          {
            key: "approve",
            text: "Duyệt bài",
            color: "#22c55e",
            onClick: handleApprove,
          },
          {
            key: "reject",
            text: "Từ chối",
            color: "#ef4444",
            onClick: () => setRejectModalVisible(true),
          },
          {
            key: "request-edit",
            text: "Yêu cầu chỉnh sửa",
            color: "#6b7280",
            onClick: () => setEditRequestModalVisible(true),
            disabled: true,
          },
          {
            key: "delete",
            text: "Xóa bài",
            color: "#6b7280",
            onClick: () => setDeleteModalVisible(true),
            disabled: true,
          },
        ],
      },

      [DOCUMENT_STATUS.PENDING_EDIT]: {
        statusBadge: {
          text: "✏️ Yêu cầu chỉnh sửa đang chờ duyệt",
          color: "text-purple-700",
          bgColor: "bg-purple-100",
          borderColor: "border-purple-300",
        },
        actionButtons: [
          {
            key: "approve",
            text: "Duyệt chỉnh sửa",
            color: "#22c55e",
            onClick: handleApprove,
          },
          {
            key: "reject",
            text: "Từ chối chỉnh sửa",
            color: "#ef4444",
            onClick: () => setRejectModalVisible(true),
          },
          {
            key: "delete",
            text: "Xóa bài",
            color: "#6b7280",
            onClick: () => setDeleteModalVisible(true),
            disabled: true,
          },
        ],
      },

      [DOCUMENT_STATUS.APPROVED]: {
        statusBadge: {
          text: "✓ Đã duyệt",
          color: "text-green-700",
          bgColor: "bg-green-100",
          borderColor: "border-green-300",
        },
        actionButtons: [
          {
            key: "request-edit",
            text: "Yêu cầu chỉnh sửa",
            color: "#f59e0b",
            onClick: () => setEditRequestModalVisible(true),
          },
          {
            key: "delete",
            text: "Xóa bài",
            color: "#ef4444",
            onClick: () => setDeleteModalVisible(true),
          },
        ],
      },
      [DOCUMENT_STATUS.REJECTED]: {
        statusBadge: {
          text: "✗ Đã từ chối",
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
        },
        actionButtons: [
          {
            key: "approve",
            text: "Duyệt lại",
            color: "#22c55e",
            onClick: handleApprove,
          },
          {
            key: "delete",
            text: "Xóa bài",
            color: "#f59e0b",
            onClick: () => setDeleteModalVisible(true),
          },
        ],
      },
      [DOCUMENT_STATUS.REQUESTED_EDIT]: {
        statusBadge: {
          text: "⚠ Yêu cầu chỉnh sửa",
          color: "text-yellow-700",
          bgColor: "bg-yellow-100",
          borderColor: "border-yellow-300",
        },
        actionButtons: [
          {
            key: "approve",
            text: "Duyệt bài",
            color: "#22c55e",
            onClick: handleApprove,
          },
          {
            key: "reject",
            text: "Từ chối",
            color: "#ef4444",
            onClick: () => setRejectModalVisible(true),
          },
          {
            key: "delete",
            text: "Xóa bài",
            color: "#f59e0b",
            onClick: () => setDeleteModalVisible(true),
          },
        ],
      },
    };

    return (
      configs[documentStatus as DocumentStatusType] || {
        statusBadge: null,
        actionButtons: [],
      }
    );
  }, [documentStatus, handleApprove]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {contextHolder}
      {/* Action buttons */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            {/* Status indicator */}
            {statusConfig.statusBadge && (
              <div
                className={`flex items-center text-xs gap-2 px-2 border rounded-md ${statusConfig.statusBadge.bgColor} ${statusConfig.statusBadge.borderColor}`}
              >
                <span
                  className={`font-medium ${statusConfig.statusBadge.color}`}
                >
                  {statusConfig.statusBadge.text}
                </span>
              </div>
            )}

            {/* Action buttons based on status */}
            {statusConfig.actionButtons.map((button) => (
              <Button
                key={button.key}
                style={{
                  backgroundColor: button.color,
                  borderColor: button.color,
                  color: "white",
                }}
                onClick={button.onClick}
                loading={button.key === "approve" ? processing : false}
                disabled={processing || button.disabled}
              >
                {button.text}
              </Button>
            ))}

            {/* Button "Xem trùng" chỉ hiển thị cho Word và PDF */}
            {canCompare && (
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
            )}
          </div>
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
            backgroundColor: "#ef4444",
            borderColor: "#ef4444",
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

      {/* Edit Request Modal */}
      <Modal
        title="Yêu cầu chỉnh sửa"
        open={editRequestModalVisible}
        onOk={handleEditRequest}
        onCancel={() => {
          setEditRequestModalVisible(false);
          setEditRequestReason("");
        }}
        okText="Gửi yêu cầu"
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
            Lý do yêu cầu chỉnh sửa:
          </label>
          <TextArea
            rows={4}
            value={editRequestReason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEditRequestReason(e.target.value)
            }
            placeholder="Nhập lý do yêu cầu chỉnh sửa tài liệu này..."
            style={{ resize: "none" }}
          />
        </div>
      </Modal>
    </>
  );
};

export default DocumentActionButtons;
