import type React from "react";
import { Avatar } from "antd";
import { School } from "lucide-react";

export interface UserInfo {
  _id: string;
  first_name: string;
  last_name: string;
  organization?: {
    _id: string;
    name: string;
  };
  avatar?: string;
  follower?: string[];
  following?: string[];
  doc_count?: number;
}

interface UserInfoHeaderProps {
  user: UserInfo;
}

const UserInfoHeader: React.FC<UserInfoHeaderProps> = ({ user }) => {
  return (
    <div className="bg-[var(--primary-background-color)] px-3 sm:px-4 py-3 sm:py-4 rounded-lg mb-4 sm:mb-6 border border-gray-200">
      {/* Mobile Layout - Stack vertically */}
      <div className="block md:hidden">
        {/* Avatar and Basic Info */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar
            size={60}
            src={user.avatar || "/placeholder.svg"}
            style={{
              backgroundColor: "#f5f5f5",
              fontSize: "20px",
              fontWeight: "600",
            }}
          >
            {`${user.first_name?.charAt(0) || ""}${
              user.last_name?.charAt(0) || ""
            }`.trim() || "U"}
          </Avatar>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-[var(--primary-color)] mb-1 truncate">
              {user.first_name || ""} {user.last_name || ""}
            </h2>
            <p className="text-xs font-medium text-black mb-1">
              ID: {user._id || "N/A"}
            </p>
            {user.organization && (
              <div className="flex items-center gap-2">
                <School size={14} className="text-black flex-shrink-0" />
                <span
                  className="text-xs text-black font-bold cursor-pointer truncate"
                  onClick={() => {
                    if (user.organization && user.organization._id) {
                      window.location.href = `/organization/${user.organization._id}`;
                    }
                  }}
                >
                  {user.organization.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats - 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm font-bold text-[var(--primary-text-color)]">
              {(user.follower?.length || 0).toLocaleString()}
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Người theo dõi
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-[var(--primary-text-color)]">
              {(user.following?.length || 0).toLocaleString()}
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Đang theo dõi
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-[var(--primary-text-color)]">
              {(user.doc_count || 0).toLocaleString()}
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Tài liệu
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-[var(--primary-text-color)]">
              0
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Điểm dùng
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-[var(--primary-text-color)]">
              0
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Điểm hạng
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-[var(--primary-text-color)]">
              0
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Cảnh cáo
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden md:flex items-center gap-6">
        {/* Avatar */}
        <Avatar
          size={80}
          src={user.avatar || "/placeholder.svg"}
          style={{
            backgroundColor: "#f5f5f5",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          {`${user.first_name?.charAt(0) || ""}${
            user.last_name?.charAt(0) || ""
          }`.trim() || "U"}
        </Avatar>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex flex-row gap-3 items-center">
            <h2 className="text-xl font-bold text-[var(--primary-color)] mb-2">
              {user.first_name || ""} {user.last_name || ""}
            </h2>
            <p className="text-xs font-medium text-black mb-1">
              ID: {user._id || "N/A"}
            </p>
          </div>

          {user.organization && (
            <div className="flex items-center gap-2 mb-3">
              <School size={16} className="text-black" />
              <span
                className="text-xs text-black  font-bold cursor-pointer"
                onClick={() => {
                  if (user.organization && user.organization._id) {
                    window.location.href = `/organization/${user.organization._id}`;
                  }
                }}
              >
                {user.organization.name}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-x-8 gap-y-4 text-center">
          {/* First row */}
          <div>
            <div className="text-xs font-bold text-[var(--primary-text-color)]">
              {(user.follower?.length || 0).toLocaleString()}
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Người theo dõi
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--primary-text-color)]">
              {(user.following?.length || 0).toLocaleString()}
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Đang theo dõi
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--primary-text-color)]">
              {(user.doc_count || 0).toLocaleString()}
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Tài liệu
            </div>
          </div>

          {/* Second row */}
          <div>
            <div className="text-xs font-bold text-[var(--primary-text-color)]">
              0
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Điểm dùng
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--primary-text-color)]">
              0
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Điểm hạng
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--primary-text-color)]">
              0
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Cảnh cáo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoHeader;
