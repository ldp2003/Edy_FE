import type React from "react";
import { Avatar } from "antd";
import { School } from "lucide-react";

interface UserInfo {
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
    <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <Avatar
          size={96}
          src={user.avatar || "/placeholder.svg"}
          style={{
            backgroundColor: "#f5f5f5",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          {user.first_name.charAt(0)}
          {user.last_name.charAt(0)}
        </Avatar>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex flex-row gap-3 items-center">
            <h2 className="text-xl font-bold text-[var(--primary-color)] mb-2">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-xs font-medium text-black mb-1">
              ID: {user._id}
            </p>
          </div>

          {user.organization && (
            <div className="flex items-center gap-2 mb-3">
              <School size={16} className="text-black" />
              <span className="text-xs text-black  font-bold">
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
              {user.follower?.length || 0}
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Người theo dõi
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--primary-text-color)]">
              {user.following?.length || 0}
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Đang theo dõi
            </div>
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--primary-text-color)]">
              {user.doc_count || 0}
            </div>
            <div className="text-xs text-[var(--primary-text-color)]">
              Bài đăng
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
