import React from "react";
import { Button, Avatar } from "antd";
import { Edit, Eye, EyeOff, Share, School } from "lucide-react";
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
  // Get buttons based on public_mode
  const renderActionButtons = () => {
    const buttons = [];

    // Edit button - always available for user's own documents
    buttons.push(
      <Button
        key="edit"
        type="default"
        icon={<Edit size={13} />}
        onClick={onEdit}
        className="flex items-center text-xs gap-2"
      >
        <div className="text-xs">Chỉnh sửa</div>
      </Button>
    );

    // Visibility change button - different based on current mode
    if (document.public_mode === "PUBLIC") {
      buttons.push(
        <Button
          key="visibility"
          type="default"
          icon={<EyeOff size={13} />}
          onClick={onChangeVisibility}
          className="flex items-center text-xs gap-2"
        >
          <div className="text-xs">Đặt riêng tư</div>
        </Button>
      );
    } else {
      buttons.push(
        <Button
          key="visibility"
          type="primary"
          icon={<Eye size={13} />}
          onClick={onChangeVisibility}
          className="flex items-center text-xs gap-2"
        >
          <div className="text-xs">Công khai</div>
        </Button>
      );
    }

    // Share button - only for non-public documents
    if (document.public_mode !== "PUBLIC") {
      buttons.push(
        <Button
          key="share"
          type="default"
          icon={<Share size={13} />}
          onClick={onShare}
          className="flex items-center text-xs gap-2"
        >
          <div className="text-xs">Chia sẻ</div>
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="ml-[24%] bg-white rounded-2xl shadow-lg px-6 py-2 mb-4">
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
        </div>
      </div>
    </div>
  );
};

export default PersonalPostHeader;
