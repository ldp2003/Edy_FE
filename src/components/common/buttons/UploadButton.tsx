import React from "react";
import { CloudUpload } from "lucide-react";

interface UploadButtonProps {
  onClick: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick }) => {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2 cursor-pointer text-white rounded hover:bg-blue-600"
      style={{ backgroundColor: "var(--primary-color)" }}
      onClick={onClick}
    >
      <CloudUpload className="w-5 h-5" />
      Thêm tài liệu mới
    </button>
  );
};

export default UploadButton;
