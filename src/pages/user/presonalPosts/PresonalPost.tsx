import React from "react";
import PersonalPostList from "../../../components/user/personalPosts/PersonalPostList";
import UserInfoHeader from "../../../components/user/personalPosts/UserInfoHeader";

const PresonalPost: React.FC = () => {
  return (
    <div className="p-4">
      <UserInfoHeader />
      <PersonalPostList />
    </div>
  );
};

export default PresonalPost;
