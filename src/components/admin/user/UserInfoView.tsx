import React from "react";
import { Avatar, Tag } from "antd";
import type { User } from "../../../models/user";

interface UserInfoViewProps {
  user: User;
}

const UserInfoView: React.FC<UserInfoViewProps> = ({ user }) => {
  const getOrganizationName = () => {
    if (typeof user.organization === "object" && user.organization) {
      return user.organization.name;
    }
    return user.organization || "Chưa có tổ chức";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "INACTIVE":
        return "orange";
      case "BANNED":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Không hoạt động";
      case "BANNED":
        return "Bị khóa";
      default:
        return status;
    }
  };

  return (
    <div className="bg-white p-3 md:p-6 rounded-lg border border-gray-300">
      <h2 className="font-bold text-xs md:text-sm mb-4 md:mb-6">
        Thông tin người dùng{" "}
        <span className="text-gray-500">ID: {user._id}</span>
      </h2>

      <div className="flex flex-col md:flex-row items-start md:space-x-6 gap-4 md:gap-0">
        {/* Avatar */}
        <div className="flex flex-col items-center md:items-start">
          <Avatar size={64} src={user.avatar} className="md:w-20 md:h-20">
            {user.last_name?.charAt(0)}
            {user.first_name?.charAt(0)}
          </Avatar>
          <p className="text-xs text-gray-500 mt-2 md:hidden">ID: {user._id}</p>
        </div>

        {/* User Info */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Họ
            </label>
            <input
              type="text"
              value={user.last_name || ""}
              readOnly
              className="w-full p-1 border border-gray-300 rounded text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Tên
            </label>
            <input
              type="text"
              value={user.first_name || ""}
              readOnly
              className="w-full p-1 border border-gray-300 rounded text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user.contact_email || ""}
              readOnly
              className="w-full p-1 border border-gray-300 rounded text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Học tập tại việc tại
            </label>
            <input
              type="text"
              value={getOrganizationName()}
              readOnly
              className="w-full p-1 border border-gray-300 rounded text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Tài khoản
            </label>
            <input
              type="text"
              value="Thường"
              readOnly
              className="w-full p-1 border border-gray-300 rounded text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Trạng thái
            </label>
            <Tag
              color={getStatusColor(user.status || "ACTIVE")}
              className="text-xs"
            >
              {getStatusText(user.status || "ACTIVE")}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoView;
