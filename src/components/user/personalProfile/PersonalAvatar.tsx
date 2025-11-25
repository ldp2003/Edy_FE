import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../contexts/UserContext";

const PersonalAvatar: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handlePostsClick = () => {
    navigate("/personal-posts");
  };

  const handleFollowerClick = () => {
    navigate("/follower");
  };

  const handleFollowingClick = () => {
    navigate("/following");
  };

  return (
    <div className="flex flex-col items-center">
      <img
        src={user?.avatar || "/image/avatar-default.svg"}
        alt="User Avatar"
        className="rounded-full w-32 md:w-40 h-32 md:h-40 border border-gray-300"
      />
      <div className="flex flex-row items-center text-xs mt-2">
        <div
          className="flex flex-col items-center mx-1 cursor-pointer hover:text-[var(--primary-color)] transition-colors"
          onClick={handleFollowerClick}
        >
          <div className="font-bold">{user?.follower?.length}</div>
          <div className="text-gray-500">Người theo dõi</div>
        </div>
        <div
          className="flex flex-col items-center mx-1 cursor-pointer hover:text-[var(--primary-color)] transition-colors"
          onClick={handleFollowingClick}
        >
          <div className="font-bold">{user?.following?.length}</div>
          <div className="text-gray-500">Đang theo dõi</div>
        </div>
        <div
          className="flex flex-col items-center mx-1 cursor-pointer hover:text-[var(--primary-color)] transition-colors"
          onClick={handlePostsClick}
        >
          <div className="font-bold">{user?.doc_count}</div>
          <div className="text-gray-500">Tài liệu</div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAvatar;
