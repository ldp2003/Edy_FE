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
      className="cursor-pointer flex items-center rounded-full px-4 py-2 text-sm font-medium"
      style={{
        color: "var(--third-text-color)",
        backgroundColor: "var(--third-color)",
      }}
      onClick={handleClick}
    >
      <Upload className="mr-2" size={16} />
      <span>Tải lên</span>
    </button>
  );
};

export default UploadHeaderButton;
