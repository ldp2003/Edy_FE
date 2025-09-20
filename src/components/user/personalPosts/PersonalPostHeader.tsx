import React from "react";
import { Button, Avatar } from "antd";
import { Edit, Eye, EyeOff, Users, Lock, Share, Globe } from "lucide-react";
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

  const visibilityInfo = getVisibilityInfo(document.public_mode || "PRIVATE");

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
    <div className="ml-[24%] bg-white rounded-lg shadow-sm border p-6 mb-4">
      {/* User Info Section */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar size={64} src={document.user.avatar} className="flex-shrink-0">
          {document.user.first_name?.[0]}
          {document.user.last_name?.[0]}
        </Avatar>

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            {document.user.first_name} {document.user.last_name}
          </h2>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              🏢 {document.organization?.name || "Không xác định"}
            </span>
          </div>

          {/* Document Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>📊 {document.user.doc_count || 0} tài liệu</span>
            <span>👥 {document.user.follower?.length || 0} người theo dõi</span>
            <span>📖 {document.user.following?.length || 0} đang theo dõi</span>
          </div>
        </div>

        {/* Visibility Status */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium"
            style={{
              color: visibilityInfo.color,
              backgroundColor: visibilityInfo.bgColor,
            }}
          >
            {visibilityInfo.icon}
            {visibilityInfo.text}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default PersonalPostHeader;
