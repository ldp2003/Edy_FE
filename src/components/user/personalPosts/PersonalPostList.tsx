import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostTable from "./PostTable";
import UploadButton from "../../common/buttons/UploadButton";

const PersonalPostList: React.FC = () => {
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();

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
    <div className="">
      <div className="flex flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-row gap-4">
          <h1
            className="text-lg font-bold"
            style={{ color: "var(--primary-text-color)" }}
          >
            Tài liệu của tôi
          </h1>
          <select
            className="px-4 text-sm w-fit border rounded h-7"
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
