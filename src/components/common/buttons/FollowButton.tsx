/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button, message } from "antd";
import { UserPlus, UserMinus } from "lucide-react";
import type { User } from "../../../models/user";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { UserService } from "../../../utils/UserService";
import { NotificationService } from "../../../utils/NotificationService";

interface FollowButtonProps {
  user: User;
  size?: "small" | "default";
  onFollowerCountChange?: (increment: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  user,
  size = "default",
  onFollowerCountChange,
}) => {
  const { user: currentUser } = useContext(UserContext);
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.following?.some(
      (followedUser: any) => followedUser._id === user._id
    )
  );
  const [messageApi, contextHolder] = message.useMessage();
  console.log("isFollowing", currentUser?.following);
  console.log("user._id", user._id);

  useEffect(() => {
    if (currentUser?.following) {
      setIsFollowing(
        currentUser.following.some(
          (followedUser: any) => followedUser._id === user._id
        )
      );
    }
  }, [currentUser?.following, user._id]);

  const handleFollow = async () => {
    try {
      const response = await UserService.followUser(user._id);
      if (response) {
        await NotificationService.createNotification({
          userId: user._id,
          type: "SYSTEM",
          message: `${currentUser?.first_name} ${currentUser?.last_name} đã theo dõi bạn.`,
        });
        setIsFollowing(true);
        onFollowerCountChange?.(true); // Tăng số lượng người theo dõi
        messageApi.success("Theo dõi thành công!");
      }
    } catch (error) {
      console.error("Error following user:", error);
      messageApi.error("Theo dõi thất bại. Vui lòng thử lại sau.");
    }
  };

  const handleUnfollow = async () => {
    try {
      const confirmUnfollow = window.confirm(
        "Bạn có chắc chắn muốn bỏ theo dõi người dùng này không?"
      );
      if (!confirmUnfollow) return;

      await UserService.unfollowUser(user._id);
      setIsFollowing(false);
      onFollowerCountChange?.(false); // Giảm số lượng người theo dõi
      messageApi.success("Bỏ theo dõi thành công!");
    } catch (error) {
      console.error("Error unfollowing user:", error);
      messageApi.error("Bỏ theo dõi thất bại. Vui lòng thử lại sau.");
    }
  };

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
        <Button
          type={size === "small" ? "primary" : "default"}
          danger={size === "small"}
          size={buttonSize}
          onClick={handleUnfollow}
          style={buttonStyle}
        >
          {size === "default" && <UserMinus className="w-4 h-4 mr-2" />}
          Bỏ theo dõi
        </Button>
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
