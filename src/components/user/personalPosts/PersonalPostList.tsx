import React, { useState } from "react";
import PostTable from "./PostTable";
import UploadButton from "../../common/buttons/UploadButton";

const PersonalPostList: React.FC = () => {
  const [viewMode, setViewMode] = useState("table");

  const renderContent = () => {
    switch (viewMode) {
      case "table":
        return <PostTable />;
      case "list":
        return <div>Hiển thị dạng danh sách</div>; // Replace with actual list component
      case "grid":
        return <div>Hiển thị dạng lưới</div>; // Replace with actual grid component
      default:
        return <PostTable />;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách bài đăng cá nhân</h1>
      <div className="flex gap-4 mb-4">
        <select
          className="px-4 py-2 border rounded"
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
        >
          <option value="table">Hiển thị dạng bảng</option>
          <option value="list">Hiển thị dạng danh sách</option>
          <option value="grid">Hiển thị dạng lưới</option>
        </select>
        <UploadButton onClick={() => console.log("Upload button clicked")} />
      </div>
      {renderContent()}
    </div>
  );
};

export default PersonalPostList;
