import React from "react";
import { Button, Avatar } from "antd";
import { Edit, Eye, EyeOff, Share, School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Document } from "../../../models/document";

interface PersonalPostHeaderProps {
  document: Document;
  onEdit?: () => void;
  onChangeVisibility?: (newMode: "PUBLIC" | "PRIVATE" | "SHARE_ORGANIZATION") => void;
  onShare?: () => void;
}

const PersonalPostHeader: React.FC<PersonalPostHeaderProps> = ({
  document,
  onEdit,
  onChangeVisibility,
}) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    if (onEdit) {
      onEdit();
    } else {
      navigate(`/personal-posts/edit/${document._id}`);
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
      icon={<Edit size={13} />}
      onClick={handleEditClick}
      className="flex items-center text-xs gap-2"
    >
      <div className="text-xs">Chỉnh sửa</div>
    </Button>
  );

  // Visibility change buttons - cycle through modes
  if (document.public_mode === "PUBLIC") {
    // From PUBLIC -> can go to SHARE_ORGANIZATION or PRIVATE
    buttons.push(
      <Button
        key="visibility-org"
        type="default"
        icon={<School size={13} />}
        onClick={() => onChangeVisibility && onChangeVisibility("SHARE_ORGANIZATION")}
        className="flex items-center text-xs gap-2"
      >
        <div className="text-xs">Chia sẻ tổ chức</div>
      </Button>
    );
    buttons.push(
      <Button
        key="visibility-private"
        type="default"
        icon={<EyeOff size={13} />}
        onClick={() => onChangeVisibility && onChangeVisibility("PRIVATE")}
        className="flex items-center text-xs gap-2"
      >
        <div className="text-xs">Đặt riêng tư</div>
      </Button>
    );
  } else if (document.public_mode === "SHARE_ORGANIZATION") {
    // From SHARE_ORGANIZATION -> can go to PUBLIC or PRIVATE
    buttons.push(
      <Button
        key="visibility-public"
        type="primary"
        icon={<Eye size={13} />}
        onClick={() => onChangeVisibility && onChangeVisibility("PUBLIC")}
        className="flex items-center text-xs gap-2"
      >
        <div className="text-xs">Công khai</div>
      </Button>
    );
    buttons.push(
      <Button
        key="visibility-private"
        type="default"
        icon={<EyeOff size={13} />}
        onClick={() => onChangeVisibility && onChangeVisibility("PRIVATE")}
        className="flex items-center text-xs gap-2"
      >
        <div className="text-xs">Đặt riêng tư</div>
      </Button>
    );
  } else { // PRIVATE
    // From PRIVATE -> can go to PUBLIC or SHARE_ORGANIZATION
    buttons.push(
      <Button
        key="visibility-public"
        type="primary"
        icon={<Eye size={13} />}
        onClick={() => onChangeVisibility && onChangeVisibility("PUBLIC")}
        className="flex items-center text-xs gap-2"
      >
        <div className="text-xs">Công khai</div>
      </Button>
    );
    buttons.push(
      <Button
        key="visibility-org"
        type="default"
        icon={<School size={13} />}
        onClick={() => onChangeVisibility && onChangeVisibility("SHARE_ORGANIZATION")}
        className="flex items-center text-xs gap-2"
      >
        <div className="text-xs">Chia sẻ tổ chức</div>
      </Button>
    );
  }

    // // Share button - only for non-public documents
    // if (document.public_mode !== "PUBLIC") {
    //   buttons.push(
    //     <Button
    //       key="share"
    //       type="default"
    //       icon={<Share size={13} />}
    //       onClick={onShare}
    //       className="flex items-center text-xs gap-2"
    //     >
    //       <div className="text-xs">Chia sẻ</div>
    //     </Button>
    //   );
    // }

    return buttons;
  };

  return (
    <div className=" bg-white rounded-2xl shadow-lg px-6 py-2 mb-4">
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
