import React, { useContext, useState } from "react";
import { Button, message } from "antd";
import { School, UserPlus, UserMinus } from "lucide-react";
import RankPointBox from "../../common/point/RankPointBox";
import type { User } from "../../../models/user";
import { UserService } from "../../../utils/UserService";
import { UserContext } from "../../../contexts/UserContext";
import { NotificationService } from "../../../utils/NotificationService";

interface UserInfoHeaderProps {
  user: User;
}

const UserInfoHeader: React.FC<UserInfoHeaderProps> = ({ user }) => {
  const { user: currentUser } = useContext(UserContext);
  const [followerCount, setFollowerCount] = useState(
    user.follower?.length || 0
  );
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.following?.includes(user._id)
  );
  const [messageApi, contextHolder] = message.useMessage();

  const follow = async () => {
    try {
      const response = await UserService.followUser(user._id);
      if (response) {
        await NotificationService.createNotification({
          userId: user._id, // ID của admin
          type: "SYSTEM", // Loại thông báo
          message: `${currentUser?.first_name} ${currentUser?.last_name} đã theo dõi bạn.`,
        });
        setFollowerCount((prev) => prev + 1); // Tăng số lượng người theo dõi
        setIsFollowing(true); // Cập nhật trạng thái nút
        messageApi.success("Theo dõi thành công!");
      }
    } catch (error) {
      console.error("Error following user:", error);
      messageApi.error("Theo dõi thất bại. Vui lòng thử lại sau.");
    }
  };

  const unfollow = async () => {
    try {
      //Hỏi người dùng có chắc chắn muốn bỏ theo dõi không
      const confirmUnfollow = window.confirm(
        "Bạn có chắc chắn muốn bỏ theo dõi người dùng này không?"
      );
      if (!confirmUnfollow) return;

      await UserService.unfollowUser(user._id);
      setFollowerCount((prev) => Math.max(prev - 1, 0)); // Giảm số lượng người theo dõi
      setIsFollowing(false); // Cập nhật trạng thái nút
      messageApi.success("Bỏ theo dõi thành công!");
    } catch (error) {
      console.error("Error unfollowing user:", error);
      messageApi.error("Bỏ theo dõi thất bại. Vui lòng thử lại sau.");
    }
  };
  return (
    <>
      {contextHolder}
      <div className="flex items-start justify-between p-4 rounded-md mb-4 bg-[var(--primary-background-color)] shadow-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-row justify-start w-full text-left items-start gap-2">
            <div className="w-15 h-15 rounded-full bg-gray-200 flex items-start justify-baseline overflow-hidden">
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Info */}
            <div className=" text-left flex flex-col gap-3">
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
              <div className="flex flex-row space-x-6">
                <div className="text-center">
                  <div className="font-semibold text-xs">{followerCount}</div>
                  <div className="text-xs">Người theo dõi</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-xs">
                    {user.following?.length || 0}
                  </div>
                  <div className="text-xs">Đang theo dõi</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-xs">
                    {user.doc_count || 0}
                  </div>
                  <div className="text-xs">Bài đăng</div>
                </div>
              </div>
              {currentUser?._id === user._id ? null : isFollowing ? (
                <Button
                  type="default"
                  size="middle"
                  onClick={unfollow}
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
                  <UserMinus className="w-4 h-4 mr-2" />
                  Bỏ theo dõi
                </Button>
              ) : (
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
                  onClick={follow}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Theo dõi
                </Button>
              )}
            </div>
          </div>
        </div>
        <RankPointBox
          rankPoints={user.rank_point || 0}
          accountStatus={
            user.status === "ACTIVE" || user.status === "INACTIVE"
              ? "Thường"
              : "VIP"
          }
        />
      </div>
    </>
  );
};

export default UserInfoHeader;
