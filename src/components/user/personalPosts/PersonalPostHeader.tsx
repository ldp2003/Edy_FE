import React, { useState, useEffect } from "react";
import { Button, Avatar, Dropdown } from "antd";
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
import { PublicMode, type PublicModeType } from "../../../models/document";
import VisibilityChangeHandler from "../../common/VisibilityChangeHandler";

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

  // Check if document is pending approval (cannot be edited or deleted)
  const isPendingApproval =
    document.status === "PENDING" || document.status === "PENDING_EDIT";

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

  const renderActionButtons = () => {
    return [
      // Edit button
      <Button
        key="edit"
        type="default"
        icon={<Edit size={13} />}
        onClick={handleEditClick}
        disabled={isPendingApproval}
        className="flex items-center text-xs gap-2"
        title={
          isPendingApproval
            ? "Không thể chỉnh sửa tài liệu đang chờ duyệt"
            : "Chỉnh sửa"
        }
      >
        <span className="text-xs">Chỉnh sửa</span>
      </Button>,

      // Visibility change handler
      <VisibilityChangeHandler
        key="visibility"
        document={document}
        currentMode={currentPublicMode}
        onModeChange={async (newMode) => {
          setCurrentPublicMode(newMode);
          document.public_mode = newMode;
          if (onChangeVisibility) {
            await onChangeVisibility(newMode);
          }
        }}
        renderTrigger={(handleVisibilityChange) => {
          // Create dropdown items
          const getAvailableOptions = () => {
            const options: { mode: PublicModeType; label: string }[] = [];

            // Thêm Công khai nếu không phải mode hiện tại
            if (currentPublicMode !== PublicMode.PUBLIC) {
              options.push({ mode: PublicMode.PUBLIC, label: "Công khai" });
            }

            // Thêm Riêng tư nếu không phải mode hiện tại
            if (currentPublicMode !== PublicMode.PRIVATE) {
              if (currentPublicMode !== PublicMode.PRIVATE_SHARED) {
                options.push({ mode: PublicMode.PRIVATE, label: "Riêng tư" });
              }
            }

            // Thêm Chia sẻ cá nhân nếu không phải mode hiện tại
            if (currentPublicMode !== PublicMode.PRIVATE_SHARED) {
              options.push({
                mode: PublicMode.PRIVATE_SHARED,
                label: "Chia sẻ cá nhân",
              });
            }

            // Thêm Chỉ tổ chức nếu không phải mode hiện tại
            if (currentPublicMode !== PublicMode.SHARE_ORGANIZATION) {
              options.push({
                mode: PublicMode.SHARE_ORGANIZATION,
                label: "Chỉ tổ chức",
              });
            }

            return options;
          };

          const dropdownItems = getAvailableOptions().map((option) => ({
            key: option.mode,
            label: (
              <div className="flex items-center gap-2">
                {getPublicModeIcon(option.mode)}
                <span>{option.label}</span>
              </div>
            ),
            onClick: () => handleVisibilityChange(option.mode),
          }));

          return (
            <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
              <Button
                type="default"
                icon={getPublicModeIcon(currentPublicMode)}
                className="flex items-center text-xs gap-2"
              >
                <span className="text-xs">Chế độ hiển thị</span>
              </Button>
            </Dropdown>
          );
        }}
      />,
    ];
  };

  return (
    <>
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
              <h3 className="font-semibold text-base text-[var(--primary-color)] text-center md:text-left">
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
    </>
  );
};

export default PersonalPostHeader;
