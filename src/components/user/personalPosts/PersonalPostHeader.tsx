import React from "react";
import { Button, Avatar } from "antd";
import {
  Edit,
  Eye,
  EyeOff,
  Users,
  Lock,
  Share,
  Globe,
  School,
} from "lucide-react";
import type { Document } from "../../../models/document";

interface PersonalPostHeaderProps {
  document: Document;
  onEdit?: () => void;
  onChangeVisibility?: () => void;
  onShare?: () => void;
}

const PersonalPostHeader: React.FC<PersonalPostHeaderProps> = ({
  document,
  onEdit,
  onChangeVisibility,
  onShare,
}) => {
  // Get icon and text based on public_mode
  const getVisibilityInfo = (mode: string) => {
    switch (mode) {
      case "PUBLIC":
        return {
          icon: <Globe size={16} />,
          text: "Công khai",
          color: "#52c41a",
          bgColor: "#f6ffed",
        };
      case "PRIVATE":
        return {
          icon: <Lock size={16} />,
          text: "Riêng tư",
          color: "#ff4d4f",
          bgColor: "#fff2f0",
        };
      case "SHARE_ORGANIZATION":
        return {
          icon: <Users size={16} />,
          text: "Chia sẻ tổ chức",
          color: "#1890ff",
          bgColor: "#f0f8ff",
        };
      case "PRIVATE_SHARED":
        return {
          icon: <Share size={16} />,
          text: "Chia sẻ riêng tư",
          color: "#fa8c16",
          bgColor: "#fff7e6",
        };
      default:
        return {
          icon: <Lock size={16} />,
          text: "Riêng tư",
          color: "#8c8c8c",
          bgColor: "#f5f5f5",
        };
    }
  };

  // Get buttons based on public_mode
  const renderActionButtons = () => {
    const buttons = [];

    // Edit button - always available for user's own documents
    buttons.push(
      <Button
        key="edit"
        type="default"
        icon={<Edit size={16} />}
        onClick={onEdit}
        className="flex items-center gap-2"
      >
        Chỉnh sửa
      </Button>
    );

    // Visibility change button - different based on current mode
    if (document.public_mode === "PUBLIC") {
      buttons.push(
        <Button
          key="visibility"
          type="default"
          icon={<EyeOff size={16} />}
          onClick={onChangeVisibility}
          className="flex items-center gap-2"
        >
          Đặt riêng tư
        </Button>
      );
    } else {
      buttons.push(
        <Button
          key="visibility"
          type="primary"
          icon={<Eye size={16} />}
          onClick={onChangeVisibility}
          className="flex items-center gap-2"
        >
          Công khai
        </Button>
      );
    }

    // Share button - only for non-public documents
    if (document.public_mode !== "PUBLIC") {
      buttons.push(
        <Button
          key="share"
          type="default"
          icon={<Share size={16} />}
          onClick={onShare}
          className="flex items-center gap-2"
        >
          Chia sẻ
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="ml-[24%] bg-white rounded-2xl shadow-lg p-6 mb-4">
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
              <School size={16} />
              <p className="text-sm font-semibold">
                {document.organization.name}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Vertical Layout */}
        <div className="flex flex-col gap-3">
          {/* Action Buttons */}
          {renderActionButtons()}
          {/* Current Status Display */}
          {(() => {
            const visibilityInfo = getVisibilityInfo(
              document.public_mode || "PRIVATE"
            );
            return (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: visibilityInfo.bgColor,
                  border: `1px solid ${visibilityInfo.color}20`,
                }}
              >
                <span style={{ color: visibilityInfo.color }}>
                  {visibilityInfo.icon}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: visibilityInfo.color }}
                >
                  {visibilityInfo.text}
                </span>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default PersonalPostHeader;
