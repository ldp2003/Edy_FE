import React, { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";

const PersonalAvatar: React.FC = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col items-center">
      <img
        src="https://i.pinimg.com/564x/dd/2d/0a/dd2d0a59ad7e79453110b2968af72d89.jpg"
        alt="User Avatar"
        className="rounded-full w-40 h-40 border border-gray-300"
      />
      <div className="flex flex-row items-center text-xs mt-2">
        <div className="flex flex-col items-center mx-1">
          <div className="font-bold">{user?.follower.length}</div>
          <div className="text-gray-500">Người theo dõi</div>
        </div>
        <div className="flex flex-col items-center mx-1">
          <div className="font-bold">{user?.following.length}</div>
          <div className="text-gray-500">Đang theo dõi</div>
        </div>
        <div className="flex flex-col items-center mx-1">
          <div className="font-bold">{user?.shared_documents.length}</div>
          <div className="text-gray-500">Bài đăng</div>
        </div>
      </div>
    </div>
  );
};

export default PersonalAvatar;
