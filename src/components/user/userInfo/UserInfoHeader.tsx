import React from "react";
import { Avatar, Button } from "antd";
import { School, UserPlus } from "lucide-react";
import RankPointBox from "../../common/point/RankPointBox";
import type { User } from "../../../models/user";

interface UserInfoHeaderProps {
  user: User;
}

const UserInfoHeader: React.FC<UserInfoHeaderProps> = ({ user }) => {
  return (
    <div className="p-4 bg-white border-b border-gray-200 rounded-xl mb-6 shadow">
      <div className="flex flex-col gap-4">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <Avatar size={80} className="bg-gray-200">
            {user.avatar ? (
              <img
                src={user.avatar}
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
              {user.first_name} {user.last_name}
            </h3>
            <div className="flex flex-row gap-2 items-center">
              <School size={16} />
              <p
                className="text-sm font-semibold cursor-pointer"
                onClick={() => {
                  if (typeof user.organization !== "string") {
                    window.location.href = `/organization/${user.organization._id}`;
                  }
                }}
              >
                {typeof user.organization === "string"
                  ? user.organization
                  : user.organization.name}
              </p>
            </div>
          </div>
        </div>

        {/* Follow Info */}
        <div
          className="flex flex-row justify-between items-center mt-4"
          style={{ color: "var(--primary-text-color)" }}
        >
          <div className="flex flex-row space-x-6">
            <div className="text-center">
              <div className="font-semibold text-xs">
                {user.follower?.length || 0}
              </div>
              <div className="text-xs">Người theo dõi</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-xs">
                {user.following?.length || 0}
              </div>
              <div className="text-xs">Đang theo dõi</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-xs">{user.doc_count || 0}</div>
              <div className="text-xs">Bài đăng</div>
            </div>
          </div>
          <Button
            type="primary"
            size="middle"
            style={{
              backgroundColor: "var(--field-background-color",
              borderColor: "#665e4c",
              color: "#000000",
              width: "100%",
              borderRadius: "20px",
              fontWeight: "500",
              height: "36px",
              borderWidth: "0.5px",
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Theo dõi
          </Button>
        </div>

        {/* Rank Point Box */}
        <div className="mt-4">
          <RankPointBox
            rankPoints={user.rank_point || 0}
            accountStatus={
              user.status === "ACTIVE" || user.status === "INACTIVE"
                ? "Thường"
                : "VIP"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default UserInfoHeader;
