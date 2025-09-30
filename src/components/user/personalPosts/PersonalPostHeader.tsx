import React, { useState, useEffect } from "react";
import { Button, Avatar, Dropdown, Modal, message } from "antd";
import {
  Edit,
  Settings,
  School,
  Globe,
  Lock,
  Users,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Document } from "../../../models/document";
import {
  PublicMode,
  publicModeLabels,
  type PublicModeType,
} from "../../../models/document";
import ShareModal from "../share/ShareModal";
import { DocumentService } from "../../../utils/DocumentService";

interface PersonalPostHeaderProps {
  document: Document;
  onEdit?: () => void;
  onChangeVisibility?: (newMode: PublicModeType) => Promise<void>;
  onShare?: () => void;
}

const PersonalPostHeader: React.FC<PersonalPostHeaderProps> = ({
  document,
  onEdit,
  onChangeVisibility,
}) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingMode, setPendingMode] = useState<PublicModeType | null>(null);
  const [currentPublicMode, setCurrentPublicMode] = useState<PublicModeType>(
    document.public_mode || PublicMode.PUBLIC
  );

  // Đồng bộ state khi document prop thay đổi
  useEffect(() => {
    setCurrentPublicMode(document.public_mode || PublicMode.PUBLIC);
  }, [document.public_mode]);

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/personal-posts/edit/${document._id}`);
    }
  };

  // Get icon for public mode
  const getPublicModeIcon = (mode: PublicModeType) => {
    switch (mode) {
      case PublicMode.PUBLIC:
        return <Globe size={13} />;
      case PublicMode.PRIVATE:
        return <Lock size={13} />;
      case PublicMode.SHARE_ORGANIZATION:
        return <Users size={13} />;
      case PublicMode.PRIVATE_SHARED:
        return <Share2 size={13} />;
      default:
        return <Settings size={13} />;
    }
  };

  // Get available options (exclude current mode và gộp chia sẻ)
  const getAvailableOptions = () => {
    const currentMode = currentPublicMode;
    const options: { mode: PublicModeType; label: string }[] = [];

    // Thêm Công khai nếu không phải mode hiện tại
    if (currentMode !== PublicMode.PUBLIC) {
      options.push({ mode: PublicMode.PUBLIC, label: "Công khai" });
    }

    // Thêm Riêng tư nếu không phải mode hiện tại
    if (currentMode !== PublicMode.PRIVATE) {
      options.push({ mode: PublicMode.PRIVATE, label: "Riêng tư" });
    }

    // Thêm Chia sẻ cá nhân nếu không phải mode hiện tại
    if (currentMode !== PublicMode.PRIVATE_SHARED) {
      options.push({
        mode: PublicMode.PRIVATE_SHARED,
        label: "Chia sẻ cá nhân",
      });
    }

    // Thêm Chỉ tổ chức nếu không phải mode hiện tại
    if (currentMode !== PublicMode.SHARE_ORGANIZATION) {
      options.push({
        mode: PublicMode.SHARE_ORGANIZATION,
        label: "Chỉ tổ chức",
      });
    }

    return options;
  };

  // Handle visibility change with confirmation
  const handleVisibilityChange = async (newMode: PublicModeType) => {
    console.log("🔄 handleVisibilityChange called with mode:", newMode);

    // Nếu chọn "Chia sẻ cá nhân" thì mở ShareModal
    if (newMode === PublicMode.PRIVATE_SHARED) {
      console.log("📤 Opening ShareModal for private sharing mode:", newMode);
      setShareModalVisible(true);
      return;
    }

    console.log("🔧 Showing confirmation modal for mode:", newMode);

    // Với các chế độ khác: PUBLIC, PRIVATE - hiển thị modal xác nhận
    setPendingMode(newMode);
    setConfirmModalVisible(true);
  };

  // Handle confirm change visibility
  const handleConfirmChangeVisibility = async () => {
    if (!pendingMode) return;

    console.log("✅ User confirmed change to:", pendingMode);
    setConfirmModalVisible(false);
    setLoading(true);

    try {
      // Sử dụng DocumentService để cập nhật
      await DocumentService.updateDocumentPublicMode(document._id, pendingMode);

      // Cập nhật trạng thái local để UI phản ánh ngay lập tức
      setCurrentPublicMode(pendingMode);
      document.public_mode = pendingMode;

      // Gọi callback nếu có để parent component cập nhật
      if (onChangeVisibility) {
        await onChangeVisibility(pendingMode);
      }

      messageApi.success(
        `Đã thay đổi chế độ hiển thị thành "${publicModeLabels[pendingMode]}"!`
      );

      // Load lại trang sau 1 giây để người dùng thấy thông báo
      setTimeout(() => {
        window.location.reload();
      }, 1000);
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

  // Create dropdown items
  const dropdownItems = getAvailableOptions().map((option) => ({
    key: option.mode,
    label: (
      <div className="flex items-center gap-2">
        {getPublicModeIcon(option.mode)}
        <span>{option.label}</span>
      </div>
    ),
    onClick: () => {
      console.log("🎯 Dropdown item clicked:", option.mode, option.label);
      handleVisibilityChange(option.mode);
    },
  }));

  console.log(
    "📋 Available dropdown options:",
    getAvailableOptions().map((opt) => `${opt.mode}: ${opt.label}`)
  );

  const renderActionButtons = () => {
    return [
      // Edit button
      <Button
        key="edit"
        type="default"
        icon={<Edit size={13} />}
        onClick={handleEditClick}
        className="flex items-center text-xs gap-2"
      >
        <span className="text-xs">Chỉnh sửa</span>
      </Button>,

      // Visibility dropdown button
      <Dropdown
        key="visibility"
        menu={{ items: dropdownItems }}
        placement="bottomRight"
        disabled={loading}
      >
        <Button
          type="default"
          loading={loading}
          icon={getPublicModeIcon(currentPublicMode)}
          className="flex items-center text-xs gap-2"
        >
          <span className="text-xs">Chế độ hiển thị</span>
        </Button>
      </Dropdown>,
    ];
  };

  return (
    <>
      {contextHolder}
      <div className=" bg-white rounded-2xl shadow-lg px-6 py-2 mb-4 text-left">
        {/* User Info Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar size={80} className="bg-gray-200">
              {document.user.avatar ? (
                <img
                  src={document.user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/placeholder.svg?height=100&width=100"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </Avatar>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-base text-[var(--primary-color)]">
                {document.user.first_name} {document.user.last_name}
              </h3>
              <div className="flex flex-row gap-2 items-center">
                <School size={13} />
                <p
                  className="text-sm font-semibold cursor-pointer"
                  onClick={() => {
                    if (document.organization && document.organization._id) {
                      window.location.href = `/organization/${document.organization._id}`;
                    }
                  }}
                >
                  {document.organization.name}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Vertical Layout */}
          <div className="flex flex-col gap-3">{renderActionButtons()}</div>
        </div>
      </div>

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
              Bạn có muốn thay đổi từ "{publicModeLabels[currentPublicMode]}"
              sang "{publicModeLabels[pendingMode]}" không?
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
        isPublic={currentPublicMode === PublicMode.PUBLIC}
        isSharedWithOrganization={
          currentPublicMode === PublicMode.SHARE_ORGANIZATION
        }
        isPrivate={currentPublicMode === PublicMode.PRIVATE}
        isPrivateShared={currentPublicMode === PublicMode.PRIVATE_SHARED}
        isOwner={true}
      />
    </>
  );
};

export default PersonalPostHeader;
