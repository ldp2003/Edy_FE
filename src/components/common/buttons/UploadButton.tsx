import React from "react";
import { CloudUpload } from "lucide-react";

interface UploadButtonProps {
  onClick: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick }) => {
  return (
    <button
      className="flex text-xs md:text-sm bg-[var(--primary-color)] items-center gap-2 px-3 md:px-4 py-2 cursor-pointer text-white rounded hover:bg-blue-600 transition-colors duration-200 w-full sm:w-auto justify-center"
      onClick={onClick}
    >
      <CloudUpload className="w-4 h-4" />
      <span className="hidden sm:inline">Thêm tài liệu mới</span>
      <span className="sm:hidden">Thêm mới</span>
    </button>
  );
};

export default UploadButton;
