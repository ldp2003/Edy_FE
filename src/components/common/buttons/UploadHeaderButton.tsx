import React from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

const UploadHeaderButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/upload-document");
  };

  return (
    <button
      className="cursor-pointer text-[var(--primary-color)] bg-[var(--third-background-color)] flex items-center rounded-full px-4 py-2 text-sm font-medium"
      onClick={handleClick}
    >
      <Upload className="mr-2" size={15} />
      <span className="text-[10px]">Tải lên</span>
    </button>
  );
};

export default UploadHeaderButton;
