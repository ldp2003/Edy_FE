import React from "react";
import { Tag, Button, Tooltip, Popconfirm, Select } from "antd";
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
  onSuspendUser: (userId: string, userName: string) => void;
  onChangeUserStatus: (userId: string, newStatus: string) => void;
  currentUserId?: string;
}

const UserItem: React.FC<UserItemProps> = ({
  user,
  onViewUser,
  onEditUser,
  onToggleUserStatus,
  onSuspendUser,
  onChangeUserStatus,
  currentUserId,
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
      className="text-left bg-white border border-gray-200 rounded-md p-2 md:p-3 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => onViewUser(user._id)}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Avatar và thông tin cơ bản */}
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium">
                {user.first_name.charAt(0)}
                {user.last_name.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Tên và trạng thái */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 text-sm truncate">
                {user.first_name} {user.last_name}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-xs whitespace-nowrap ${statusColor} ${statusBg}`}
              >
                {statusText}
              </span>
              <Select
                value={user.status}
                onChange={(value) => onChangeUserStatus(user._id, value)}
                size="small"
                style={{ width: 100 }}
                disabled={user._id === currentUserId}
              >
                <Select.Option value="ACTIVE">Hoạt động</Select.Option>
                <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
                <Select.Option value="BANNED">Bị khóa</Select.Option>
              </Select>
            </div>

            {/* Email và thông tin cơ bản */}
            <div className="text-xs text-gray-500 truncate mb-1">
              {user.contact_email}
            </div>

            {/* Thông tin bổ sung trên cùng dòng */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>
                <span className="font-medium">Tổ chức:</span>{" "}
                {typeof user.organization === "object" && user.organization
                  ? user.organization.name
                  : "Chưa có"}
              </span>
              <span>
                <span className="font-medium">Lĩnh vực:</span>{" "}
                {user.field_of_study && user.field_of_study.length > 0
                  ? user.field_of_study.slice(0, 1).join("")
                  : "N/A"}
              </span>
            </div>

            {/* Vai trò và thống kê trên cùng dòng */}
            <div className="flex items-center justify-between mt-1">
              {/* Vai trò */}
              <div className="flex items-center gap-1">
                {user.role_names && user.role_names.length > 0 && (
                  <>
                    <span className="text-xs font-medium text-gray-500">
                      Vai trò:
                    </span>
                    <div className="flex gap-1">
                      {user.role_names.slice(0, 2).map((role, index) => (
                        <Tag
                          key={index}
                          color="blue"
                          className="text-xs px-1 py-0 h-4"
                        >
                          {getRoleDisplayName(role)}
                        </Tag>
                      ))}
                      {user.role_names.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{user.role_names.length - 2}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Thống kê */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>
                  <span className="font-medium text-gray-900">
                    {user.doc_count || 0}
                  </span>{" "}
                  Tài liệu
                </span>
                <span>
                  <span className="font-medium text-gray-900">
                    {user.point || 0}
                  </span>{" "}
                  Điểm dùng
                </span>
                <span>
                  <span className="font-medium text-gray-900">
                    {user.rank_point || 0}
                  </span>{" "}
                  Điểm hạng
                </span>
                <span
                  className={
                    (user.strike || 0) > 0 ? "text-red-600 font-medium" : ""
                  }
                >
                  {user.strike || 0} Cảnh cáo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-1">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<Edit size={12} />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEditUser(user._id);
              }}
              className="w-6 h-6"
            />
          </Tooltip>

          <Popconfirm
            title={
              user.status === "ACTIVE"
                ? "Khóa tài khoản người dùng?"
                : "Mở khóa tài khoản người dùng?"
            }
            onConfirm={(e) => {
              e?.stopPropagation();
              if (user.status === "ACTIVE") {
                onSuspendUser(user._id, `${user.first_name} ${user.last_name}`);
              } else {
                onToggleUserStatus(user._id, user.status);
              }
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
                    <Lock size={12} />
                  ) : (
                    <Unlock size={12} />
                  )
                }
                size="small"
                onClick={(e) => e.stopPropagation()}
                danger={user.status === "ACTIVE"}
                className="w-6 h-6"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
