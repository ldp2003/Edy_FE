import React, { useState } from "react";
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
  const [loading, setLoading] = useState(false);

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

  // Get available options (exclude current mode)
  const getAvailableOptions = () => {
    const allModes = Object.values(PublicMode) as PublicModeType[];
    return allModes.filter((mode) => mode !== document.public_mode);
  };

  // Handle visibility change with confirmation
  const handleVisibilityChange = async (newMode: PublicModeType) => {
    const currentModeLabel =
      publicModeLabels[document.public_mode || PublicMode.PUBLIC];
    const newModeLabel = publicModeLabels[newMode];

    Modal.confirm({
      title: "Xác nhận thay đổi chế độ hiển thị",
      content: `Bạn có muốn thay đổi từ "${currentModeLabel}" sang "${newModeLabel}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        if (onChangeVisibility) {
          setLoading(true);
          try {
            await onChangeVisibility(newMode);
            message.success("Đã cập nhật chế độ hiển thị thành công!");
          } catch (error) {
            console.error("Error changing visibility:", error);
            message.error("Không thể cập nhật chế độ hiển thị!");
          } finally {
            setLoading(false);
          }
        }
      },
    });
  };

  // Create dropdown items
  const dropdownItems = getAvailableOptions().map((mode) => ({
    key: mode,
    label: (
      <div className="flex items-center gap-2">
        {getPublicModeIcon(mode)}
        <span>{publicModeLabels[mode]}</span>
      </div>
    ),
    onClick: () => handleVisibilityChange(mode),
  }));

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
          icon={getPublicModeIcon(document.public_mode || PublicMode.PUBLIC)}
          className="flex items-center text-xs gap-2"
        >
          <span className="text-xs">Chế độ hiển thị</span>
        </Button>
      </Dropdown>,
    ];
  };

  return (
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
  );
};

export default PersonalPostHeader;
