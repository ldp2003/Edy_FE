import React from "react";
import PersonalPostList from "../../../components/user/personalPosts/PersonalPostList";
import UserInfoHeader from "../../../components/user/personalPosts/UserInfoHeader";

const PersonalPost: React.FC = () => {
  return (
    <div className="p-2 md:p-4 min-h-screen bg-gray-50">
      <UserInfoHeader />
      <PersonalPostList />
    </div>
  );
};

export default PersonalPost;
