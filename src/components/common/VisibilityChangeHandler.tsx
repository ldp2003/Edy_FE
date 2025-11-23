import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import type { Document } from "../../models/document";
import {
  PublicMode,
  publicModeLabels,
  type PublicModeType,
} from "../../models/document";
import ShareModal from "../user/share/ShareModal";
import { DocumentService } from "../../utils/DocumentService";

interface VisibilityChangeHandlerProps {
  document: Document;
  currentMode: PublicModeType;
  onModeChange?: (newMode: PublicModeType) => Promise<void>;
  renderTrigger: (
    handleVisibilityChange: (mode: PublicModeType) => void
  ) => React.ReactNode;
}

const VisibilityChangeHandler: React.FC<VisibilityChangeHandlerProps> = ({
  document,
  currentMode,
  onModeChange,
  renderTrigger,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingMode, setPendingMode] = useState<PublicModeType | null>(null);
  const [currentModalMode, setCurrentModalMode] =
    useState<PublicModeType>(currentMode);

  // Đồng bộ currentModalMode với currentMode khi prop thay đổi
  useEffect(() => {
    setCurrentModalMode(currentMode);
  }, [currentMode]);

  // Handle visibility change with confirmation
  const handleVisibilityChange = async (newMode: PublicModeType) => {
    // Nếu chọn "Chia sẻ cá nhân" thì mở ShareModal ngay lập tức, không chạy API
    if (newMode === PublicMode.PRIVATE_SHARED) {
      // Update modal mode and open ShareModal immediately without any API calls
      setCurrentModalMode(newMode);
      setShareModalVisible(true);
      return;
    }

    // Với các chế độ khác: PUBLIC, PRIVATE - hiển thị modal xác nhận
    setPendingMode(newMode);
    setConfirmModalVisible(true);
  };

  // Handle confirm change visibility
  const handleConfirmChangeVisibility = async () => {
    if (!pendingMode) return;

    setConfirmModalVisible(false);
    setLoading(true);

    try {
      // Call API to update document public mode
      await DocumentService.updateDocumentPublicMode(document._id, pendingMode);

      // Call callback if provided
      if (onModeChange) {
        await onModeChange(pendingMode);
      }

      messageApi.success(
        `Đã thay đổi chế độ hiển thị thành "${publicModeLabels[pendingMode]}"!`
      );
    } catch (error) {
      console.error("Error changing visibility:", error);
      messageApi.error("Không thể cập nhật chế độ hiển thị!");
    } finally {
      setLoading(false);
      setPendingMode(null);
    }
  };

  // Handle cancel change visibility
  const handleCancelChangeVisibility = () => {
    setConfirmModalVisible(false);
    setPendingMode(null);
  };

  return (
    <>
      {contextHolder}
      {renderTrigger(handleVisibilityChange)}

      {/* Confirmation Modal */}
      <Modal
        title="Xác nhận thay đổi chế độ hiển thị"
        open={confirmModalVisible}
        onOk={handleConfirmChangeVisibility}
        onCancel={handleCancelChangeVisibility}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        {pendingMode && (
          <div>
            <p>
              Bạn có muốn thay đổi từ "{publicModeLabels[currentMode]}" sang "
              {publicModeLabels[pendingMode]}" không?
            </p>
            {pendingMode === PublicMode.SHARE_ORGANIZATION && (
              <p className="mt-2 text-orange-600 bg-orange-50 p-2 rounded">
                ⚠️ Nếu bạn để chế độ này, chỉ có người trong tổ chức mới có thể
                xem tài liệu.
              </p>
            )}
          </div>
        )}
      </Modal>

      {/* ShareModal */}
      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        documentId={document._id}
        documentTitle={document.title}
        isPublic={currentModalMode === PublicMode.PUBLIC}
        isSharedWithOrganization={
          currentModalMode === PublicMode.SHARE_ORGANIZATION
        }
        isPrivate={currentModalMode === PublicMode.PRIVATE}
        isPrivateShared={currentModalMode === PublicMode.PRIVATE_SHARED}
        isOwner={true}
      />
    </>
  );
};

export default VisibilityChangeHandler;
