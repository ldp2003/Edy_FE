import React from "react";
import { CloudUpload } from "lucide-react";

interface UploadButtonProps {
  onClick: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick }) => {
  return (
    <button
      className="flex text-xs bg-[var(--primary-color)] items-center gap-2 px-4 py-2 cursor-pointer text-white rounded hover:bg-blue-600"
      onClick={onClick}
    >
      <CloudUpload className="w-4 h-4" />
      Thêm tài liệu mới
    </button>
  );
};

export default UploadButton;
