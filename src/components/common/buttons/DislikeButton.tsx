import { ThumbsDown } from "lucide-react";
import React from "react";

const DislikeButton: React.FC<{ dislikeCount: number }> = ({
  dislikeCount,
}) => {
  return (
    <div>
      <button className="text-xs flex items-center space-x-2 bg-white rounded-2xl border border-gray-300 px-3 py-1 font-semibold cursor-pointer text-[var(--red-button-color)] transition-colors duration-300 hover:bg-[#d63847] hover:text-white">
        <ThumbsDown size={15} />
        <span className="text-xs">{dislikeCount}</span>
      </button>
    </div>
  );
};

export default DislikeButton;
