import React from "react";
import PostTable from "./PostTable";

const PersonalPostList: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách bài đăng cá nhân</h1>
      <PostTable />
    </div>
  );
};

export default PersonalPostList;
