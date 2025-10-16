import { Avatar, Button, message } from "antd";
import { School, UserPlus, UserMinus } from "lucide-react";
import type { Document } from "../../../models/document";
import { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { UserService } from "../../../utils/UserService";
import { NotificationService } from "../../../utils/NotificationService";

interface AuthorInfoProps {
  document: Document;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ document }) => {
  const [followerCount, setFollowerCount] = useState(
    document.user.follower?.length || 0
  );
  const { user: currentUser } = useContext(UserContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.following?.includes(document.user._id)
  );
  const handlerOnclick = () => {
    // user-profile/:userId
    window.location.href = `/user/${document.user._id}`;
  };
  const follow = async () => {
    try {
      const response = await UserService.followUser(document.user._id);
      if (response) {
        await NotificationService.createNotification({
          userId: document.user._id, // ID của admin
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

      await UserService.unfollowUser(document.user._id);
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
      <div className="flex text-left items-center justify-between p-4 bg-white border-b border-gray-200 rounded-xl mb-6 shadow">
        <div className="flex items-center flex-row gap-4">
          <Avatar size={80} className="bg-gray-200">
            {document.user.avatar ? (
              <img
                src={document.user.avatar}
                alt="Avatar"
                className="cursor-pointer w-full h-full object-cover"
                onClick={handlerOnclick}
              />
            ) : (
              <img
                src="/placeholder.svg?height=100&width=100"
                alt="Avatar"
                className="cursor-pointer w-full h-full object-cover"
                onClick={handlerOnclick}
              />
            )}
          </Avatar>
          <div className="flex flex-col gap-3">
            <h3
              className="font-semibold text-base text-[var(--primary-color)] cursor-pointer"
              onClick={handlerOnclick}
            >
              {document.user.first_name} {document.user.last_name}
            </h3>
            <div className="flex flex-row gap-2 items-center">
              <School size={16} />
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

        <div
          className="flex flex-col items-center space-y-2"
          style={{ color: "var(--primary-text-color)" }}
        >
          <div className="flex flex-row space-x-6">
            <div className="text-center">
              <div className="font-semibold text-xs">{followerCount}</div>
              <div className="text-xs">Người theo dõi</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-xs">
                {document.user.following?.length || 0}
              </div>
              <div className="text-xs">Đang theo dõi</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-xs">
                {document.user.doc_count || 0}
              </div>
              <div className="text-xs">Bài đăng</div>
            </div>
          </div>
          {currentUser?._id === document.user._id ? null : isFollowing ? (
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
              onClick={follow}
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
          )}
        </div>
      </div>
    </>
  );
};
export default AuthorInfo;
