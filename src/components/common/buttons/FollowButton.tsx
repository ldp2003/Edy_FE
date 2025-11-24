/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button, message, Popconfirm } from "antd";
import { UserPlus, UserMinus } from "lucide-react";
import type { User } from "../../../models/user";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { UserService } from "../../../utils/UserService";
import { NotificationService } from "../../../utils/NotificationService";

interface FollowButtonProps {
  user: User;
  size?: "small" | "default";
  onFollowerCountChange?: (increment: boolean) => void;
  onUpdateFollowing?: (add: boolean, targetUser: User) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  user,
  size = "default",
  onFollowerCountChange,
  onUpdateFollowing,
}) => {
  const { user: currentUser } = useContext(UserContext);
  const [isFollowing, setIsFollowing] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // Kiểm tra trạng thái following một lần khi component mount hoặc khi currentUser.following thay đổi
  useEffect(() => {
    if (currentUser?.following) {
      const isUserFollowed = currentUser.following.some(
        (followedUser: any) => followedUser._id === user._id
      );
      setIsFollowing(isUserFollowed);
    }
  }, [currentUser?.following, user._id]);

  const handleFollow = useCallback(async () => {
    try {
      const response = await UserService.followUser(user._id);
      if (response) {
        // Tạo thông báo cho người được follow
        await NotificationService.createFollowNotification(
          {
            _id: currentUser?._id || "",
            first_name: currentUser?.first_name || "",
            last_name: currentUser?.last_name || "",
          },
          user._id
        );
        setIsFollowing(true);
        onFollowerCountChange?.(true);
        onUpdateFollowing?.(true, user);
        messageApi.success("Theo dõi thành công!");
      }
    } catch (error) {
      console.error("Error following user:", error);
      messageApi.error("Theo dõi thất bại. Vui lòng thử lại sau.");
    }
  }, [
    currentUser?.first_name,
    currentUser?.last_name,
    currentUser?._id,
    messageApi,
    onFollowerCountChange,
    onUpdateFollowing,
    user,
  ]);

  const handleUnfollow = useCallback(async () => {
    try {
      await UserService.unfollowUser(user._id);
      setIsFollowing(false);
      onFollowerCountChange?.(false);
      onUpdateFollowing?.(false, user);
      messageApi.success("Bỏ theo dõi thành công!");
    } catch (error) {
      console.error("Error unfollowing user:", error);
      messageApi.error("Bỏ theo dõi thất bại. Vui lòng thử lại sau.");
    }
  }, [messageApi, onFollowerCountChange, onUpdateFollowing, user]);

  // Style cho size small (như trong FollowItem)
  const smallButtonStyle = {
    borderRadius: "4px",
    height: "32px",
    fontSize: "14px",
  };

  // Style cho size default (như trong AuthorInfo và UserInfoHeader)
  const defaultButtonStyle = {
    backgroundColor: "var(--field-background-color)",
    borderColor: "#665e4c",
    color: "#000000",
    width: "100%",
    borderRadius: "20px",
    fontWeight: "500",
    height: "36px",
    borderWidth: "0.5px",
  };

  const buttonStyle = size === "small" ? smallButtonStyle : defaultButtonStyle;
  const buttonSize = size === "small" ? "small" : "middle";

  // Kiểm tra xem có phải chính người dùng đang xem profile của chính họ không
  if (currentUser?._id === user._id) {
    return null;
  }

  return (
    <>
      {contextHolder}
      {isFollowing ? (
        <Popconfirm
          title="Bạn có chắc chắn muốn bỏ theo dõi người dùng này không?"
          onConfirm={handleUnfollow}
          okText="Có"
          cancelText="Không"
        >
          <Button
            type={size === "small" ? "primary" : "default"}
            danger={size === "small"}
            size={buttonSize}
            style={buttonStyle}
          >
            {size === "default" && <UserMinus className="w-4 h-4 mr-2" />}
            Bỏ theo dõi
          </Button>
        </Popconfirm>
      ) : (
        <Button
          type="primary"
          size={buttonSize}
          onClick={handleFollow}
          style={buttonStyle}
        >
          {size === "default" && <UserPlus className="w-4 h-4 mr-2" />}
          Theo dõi
        </Button>
      )}
    </>
  );
};

export default FollowButton;
