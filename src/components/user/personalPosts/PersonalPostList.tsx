import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostTable from "./PostTable";
import PostListView from "./PostListView";
import PostGridView from "./PostGridView";
import UploadButton from "../../common/buttons/UploadButton";

const PersonalPostList: React.FC = () => {
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (viewMode) {
      case "table":
        return <PostTable />;
      case "list":
        return <PostListView />;
      case "grid":
        return <PostGridView />;
      default:
        return <PostTable />;
    }
  };

  return (
    <div className="">
      <div className="flex flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-base font-bold text-[var(--primary-text-color)]">
            Tài liệu của tôi
          </h1>
          <select
            className="px-4 text-xs w-fit border rounded h-5"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="table">Hiển thị dạng bảng</option>
            <option value="list">Hiển thị dạng danh sách</option>
            <option value="grid">Hiển thị dạng lưới</option>
          </select>
        </div>

        <UploadButton onClick={() => navigate("/upload-document")} />
      </div>
      {renderContent()}
    </div>
  );
};

export default PersonalPostList;
