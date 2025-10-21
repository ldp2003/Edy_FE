import React from "react";
import { Tag, Button, Tooltip, Popconfirm } from "antd";
import { Edit, Lock, Unlock } from "lucide-react";
import type { User } from "../../../models/user";
import { getRoleDisplayName } from "../../../constants/RoleConstants";

interface UserDisplay extends User {
  index: number;
  role_names?: string[];
}

interface UserItemProps {
  user: UserDisplay;
  onViewUser: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onToggleUserStatus: (userId: string, currentStatus?: string) => void;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
  onViewUser,
  onEditUser,
  onToggleUserStatus,
}) => {
  const getStatusDisplay = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return {
          text: "Hoạt động",
          color: "text-green-600",
          bg: "bg-green-50",
        };
      case "BANNED":
        return {
          text: "Bị khóa",
          color: "text-red-600",
          bg: "bg-red-50",
        };
      case "INACTIVE":
        return {
          text: "Không hoạt động",
          color: "text-gray-600",
          bg: "bg-gray-50",
        };
      default:
        return {
          text: "N/A",
          color: "text-gray-600",
          bg: "bg-gray-50",
        };
    }
  };

  const {
    text: statusText,
    color: statusColor,
    bg: statusBg,
  } = getStatusDisplay(user.status);

  // Chia roles thành các nhóm của 2
  const roleGroups = [];
  if (user.role_names && user.role_names.length > 0) {
    for (let i = 0; i < user.role_names.length; i += 2) {
      roleGroups.push(user.role_names.slice(i, i + 2));
    }
  }

  return (
    <div
      className="text-left bg-white border border-gray-200 rounded-lg p-3 md:p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewUser(user._id)}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        {/* Avatar và thông tin cơ bản */}
        <div className="flex items-start space-x-3 flex-1">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {user.first_name.charAt(0)}
                {user.last_name.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Tên và email */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
              <span className="font-semibold text-gray-900 truncate">
                {user.first_name} {user.last_name}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${statusColor} ${statusBg}`}
              >
                {statusText}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-2 truncate">
              {user.contact_email}
            </div>

            {/* Thông tin bổ sung */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
              <div>
                <span className="font-medium">Tổ chức:</span>{" "}
                {typeof user.organization === "object" && user.organization
                  ? user.organization.name
                  : "Chưa có"}
              </div>
              <div>
                <span className="font-medium">Lĩnh vực:</span>{" "}
                {user.field_of_study && user.field_of_study.length > 0
                  ? user.field_of_study.slice(0, 1).join("") +
                    (user.field_of_study.length > 1 ? "..." : "")
                  : "N/A"}
              </div>
            </div>

            {/* Vai trò */}
            {roleGroups.length > 0 && (
              <div className="mb-2">
                <span className="text-xs font-medium text-gray-500 mr-2">
                  Vai trò:
                </span>
                <div className="flex flex-col gap-1">
                  {roleGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex gap-1 flex-wrap">
                      {group.map((role, index) => (
                        <Tag
                          key={`${groupIndex}-${index}`}
                          color="blue"
                          className="text-xs"
                        >
                          {getRoleDisplayName(role)}
                        </Tag>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thống kê */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-500">
              <div className="text-center">
                <div className="font-medium text-gray-900">
                  {user.doc_count || 0}
                </div>
                <div>Tài liệu</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">
                  {user.point || 0}
                </div>
                <div>Điểm</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">
                  {user.rank_point || 0}
                </div>
                <div>Xếp hạng</div>
              </div>
              <div className="text-center">
                <div
                  className={`font-medium ${
                    (user.strike || 0) > 0 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {user.strike || 0}
                </div>
                <div>Cảnh cáo</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row md:flex-col space-x-1 md:space-x-0 md:space-y-1 justify-end">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<Edit size={14} />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEditUser(user._id);
              }}
              className="w-8 h-8"
            />
          </Tooltip>

          <Popconfirm
            title={
              user.status === "ACTIVE"
                ? "Khóa tài khoản?"
                : "Mở khóa tài khoản?"
            }
            onConfirm={(e) => {
              e?.stopPropagation();
              onToggleUserStatus(user._id, user.status);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Có"
            cancelText="Không"
          >
            <Tooltip
              title={
                user.status === "ACTIVE"
                  ? "Khóa tài khoản"
                  : "Mở khóa tài khoản"
              }
            >
              <Button
                type="text"
                icon={
                  user.status === "ACTIVE" ? (
                    <Lock size={14} />
                  ) : (
                    <Unlock size={14} />
                  )
                }
                size="small"
                onClick={(e) => e.stopPropagation()}
                danger={user.status === "ACTIVE"}
                className="w-8 h-8"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
