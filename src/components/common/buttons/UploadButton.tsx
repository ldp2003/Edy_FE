import React from "react";

interface UploadButtonProps {
  onClick: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onClick }) => {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.5M7.5 12l4.5-4.5m0 0l4.5 4.5m-4.5-4.5V18"
        />
      </svg>
      Thêm tài liệu mới
    </button>
  );
};

export default UploadButton;
