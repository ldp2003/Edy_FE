import { ThumbsDown } from "lucide-react";
import React from "react";

const DislikeButton: React.FC<{ dislikeCount: number }> = ({
  dislikeCount,
}) => {
  return (
    <div>
      <button
        className="flex items-center space-x-2 bg-white hover:bg-[#d63847] rounded-2xl border border-gray-300 px-3 py-1 font-semibold cursor-pointer"
        style={{
          color: "var(--red-button-color)",
          transition: "color 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--red-button-color)";
        }}
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{dislikeCount}</span>
      </button>
    </div>
  );
};

export default DislikeButton;
