import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Button, Modal, message, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { NotificationService } from "../../../../utils/NotificationService";
import { DocumentService } from "../../../../utils/DocumentService";
import type { PendingRequest } from "../../../../models/document";

const { TextArea } = Input;

interface DocumentActionButtonsProps {
  documentRequest: PendingRequest | null;
  isIntensive: boolean;
  documentId: string;
  documentStatus?: string;
  documentType?: string;
  onSuccess?: () => void; // Callback sau khi thực hiện thành công
}

const DocumentActionButtons: React.FC<DocumentActionButtonsProps> = ({
  documentRequest,
  isIntensive,
  documentId,
  documentStatus,
  documentType,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editRequestModalVisible, setEditRequestModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [editRequestReason, setEditRequestReason] = useState("");
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  // Fetch document title when component mounts
  useEffect(() => {
    const fetchDocumentTitle = async () => {
      if (documentRequest?.doc) {
        try {
          const documentData = await DocumentService.getDocumentById(
            documentRequest.doc
          );
          setDocumentTitle(documentData.title || "Tài liệu");
        } catch (error) {
          console.error("Error fetching document title:", error);
          setDocumentTitle("Tài liệu");
        }
      }
    };

    fetchDocumentTitle();
  }, [documentRequest?.doc]);

  // Document status constants
  const DOCUMENT_STATUS = {
    PENDING: "PENDING",
    PENDING_EDIT: "PENDING_EDIT",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    REQUESTED_EDIT: "REQUESTED_EDIT",
    DELETED: "DELETED",
  } as const;

  type DocumentStatusType =
    (typeof DOCUMENT_STATUS)[keyof typeof DOCUMENT_STATUS];

  const handleApprove = useCallback(async () => {
    if (!documentRequest) {
      messageApi.error("Không tìm thấy request tài liệu!");
      return;
    }

    try {
      setProcessing(true);

      // Gọi API duyệt tài liệu trực tiếp
      if (documentStatus === DOCUMENT_STATUS.PENDING) {
        await DocumentService.approveDocumentByRequestId(
          documentRequest._id,
          isIntensive ? { isIntensive: true } : undefined
        );
      } else if (documentStatus === DOCUMENT_STATUS.PENDING_EDIT) {
        await DocumentService.handleEditApproval(documentRequest._id, {
          action: "APPROVE",
        });
      }

      messageApi.success("Tài liệu đã được duyệt thành công!");

      // Send notification to the document owner
      if (documentRequest.requester && documentTitle) {
        await NotificationService.createDocumentApprovedNotification(
          documentRequest.requester,
          documentRequest.doc,
          documentTitle
        );
      }

      // Gọi callback nếu có
      if (onSuccess) {
        onSuccess();
      }

      // Reload page after 1.5s
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      messageApi.error(error.response.data.message);
    } finally {
      setProcessing(false);
    }
  }, [documentRequest, isIntensive, messageApi, documentTitle, onSuccess]);

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
      setProcessing(true);

      if (documentStatus === DOCUMENT_STATUS.PENDING) {
        await DocumentService.rejectDocumentByRequestId(
          documentRequest._id,
          rejectReason
        );
      } else if (documentStatus === DOCUMENT_STATUS.PENDING_EDIT) {
        await DocumentService.handleEditApproval(documentRequest._id, {
          action: "REJECT",
          message: rejectReason,
        });
      }

      messageApi.success("Tài liệu đã được từ chối!");
      setRejectModalVisible(false);
      setRejectReason("");

      // Send notification to the document owner
      if (documentRequest.requester && documentTitle) {
        await NotificationService.createDocumentRejectedNotification(
          documentRequest.requester,
          documentRequest.doc,
          documentTitle,
          rejectReason
        );
      }

      // Gọi callback nếu có
      if (onSuccess) {
        onSuccess();
      }

      // Reload page after 1.5s
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      messageApi.error(error.response.data.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      messageApi.error("Vui lòng nhập lý do xóa bài!");
      return;
    }

    try {
      setProcessing(true);

      // Gọi API xóa tài liệu trực tiếp
      await DocumentService.deleteDocument(documentId, deleteReason);

      messageApi.success("Tài liệu đã được xóa!");
      setDeleteModalVisible(false);
      setDeleteReason("");

      // Send notification to the document owner
      if (documentRequest?.requester && documentTitle) {
        await NotificationService.createDocumentRemovedNotification(
          documentRequest.requester,
          documentRequest.doc,
          documentTitle,
          deleteReason
        );
      }

      // Gọi callback nếu có
      if (onSuccess) {
        onSuccess();
      }

      // Reload page after 1.5s
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      messageApi.error(error.response.data.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleEditRequest = async () => {
    if (!documentRequest) {
      messageApi.error("Không tìm thấy request tài liệu!");
      return;
    }

    if (!editRequestReason.trim()) {
      messageApi.error("Vui lòng nhập lý do yêu cầu chỉnh sửa!");
      return;
    }

    try {
      setProcessing(true);

      // Gọi API yêu cầu chỉnh sửa trực tiếp
      await DocumentService.requestEditDocument(
        documentRequest._id,
        editRequestReason
      );

      messageApi.success("Đã gửi yêu cầu chỉnh sửa!");
      setEditRequestModalVisible(false);
      setEditRequestReason("");

      // Send notification to the document owner
      if (documentRequest?.requester && documentTitle) {
        await NotificationService.createDocumentEditRequestedNotification(
          documentRequest.requester,
          documentRequest.doc,
          documentTitle,
          editRequestReason
        );
      }

      // Gọi callback nếu có
      if (onSuccess) {
        onSuccess();
      }

      // Refresh page sau 1.5s để cập nhật trạng thái
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      messageApi.error(error.response.data.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleEditRequestDocument = async () => {
    if (!documentId) {
      messageApi.error("Không tìm thấy tài liệu!");
      return;
    }

    if (!editRequestReason.trim()) {
      messageApi.error("Vui lòng nhập lý do yêu cầu chỉnh sửa!");
      return;
    }

    try {
      setProcessing(true);

      // Gọi API yêu cầu chỉnh sửa trực tiếp
      await DocumentService.requestEditDirectDocument(
        documentId,
        editRequestReason
      );

      messageApi.success("Đã gửi yêu cầu chỉnh sửa!");
      setEditRequestModalVisible(false);
      setEditRequestReason("");

      // Send notification to the document owner
      if (documentRequest?.requester && documentTitle) {
        await NotificationService.createDocumentEditRequestedNotification(
          documentRequest.requester,
          documentRequest.doc,
          documentTitle,
          editRequestReason
        );
      }

      // Gọi callback nếu có
      if (onSuccess) {
        onSuccess();
      }

      // Refresh page sau 1.5s để cập nhật trạng thái
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Edit request error:", error);
      messageApi.error("Có lỗi xảy ra khi gửi yêu cầu chỉnh sửa!");
    } finally {
      setProcessing(false);
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
            color: "#f59e0b",
            onClick: () => setEditRequestModalVisible(true),
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

      [DOCUMENT_STATUS.DELETED]: {
        statusBadge: {
          text: "✗ Đã xóa",
          color: "text-red-700",
          bgColor: "bg-red-100",
          borderColor: "border-red-300",
        },
        actionButtons: [],
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
        title={
          documentStatus === DOCUMENT_STATUS.PENDING_EDIT
            ? "Từ chối chỉnh sửa"
            : "Từ chối tài liệu"
        }
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
        onOk={
          documentStatus === DOCUMENT_STATUS.PENDING
            ? handleEditRequest
            : handleEditRequestDocument
        }
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
