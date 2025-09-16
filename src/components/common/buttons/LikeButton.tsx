import { ThumbsUp } from "lucide-react";
import React from "react";

const LikeButton: React.FC<{ likeCount: number }> = ({ likeCount }) => {
  return (
    <div>
      <button
        className="flex items-center space-x-2 bg-white hover:bg-[#27a743] rounded-2xl border border-gray-300 px-3 py-1 font-semibold cursor-pointer"
        style={{
          color: "var(--green-button-color)",
          transition: "color 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--green-button-color)";
        }}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{likeCount}</span>
      </button>
    </div>
  );
};

export default LikeButton;
