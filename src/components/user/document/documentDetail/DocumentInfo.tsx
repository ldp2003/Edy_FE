import React from "react";
import { Backpack, FolderClosed, School } from "lucide-react";
import IntensiveMark from "../documentElement/IntensiveMark";

const DocumentInfo: React.FC = () => {
  return (
    <div className="space-y-4 text-sm document-info">
      <div
        className="text-lg font-bold"
        style={{
          color: "var(--secondary-text-color)",
        }}
      >
        Tài liệu tổng hợp Kinh tế chính trị Mác LêNin
      </div>
      <IntensiveMark label="Chuyên sâu"></IntensiveMark>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1 flex-row items-center">
          <School size={20} />
          <span className="text-lg font-medium">Thuộc:</span>
        </div>

        <span className="font-bold" style={{ color: "var(--primary-color)" }}>
          Trường đại học Công nghiệp Thành phố Hồ Chí Minh
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1 flex-row items-center">
          <FolderClosed size={20} />
          <span className="text-lg font-medium">Môn:</span>
        </div>

        <span className="font-bold" style={{ color: "var(--primary-color)" }}>
          Kinh tế chính trị Mác LêNin
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1 flex-row items-center">
          <Backpack size={20} />
          <span className="text-lg font-medium">Trình độ:</span>
        </div>

        <span className="font-bold" style={{ color: "var(--primary-color)" }}>
          Đại học
        </span>
      </div>
      <div
        className="flex flex-col gap-1 border-y-1 border-gray-200 py-4"
        style={{ color: "var(--secondary-text-color)" }}
      >
        <span className="font-bold">Đăng tải lúc:</span>
        <span>13:12:00 03/09/2025</span>
      </div>
    </div>
  );
};

export default DocumentInfo;
