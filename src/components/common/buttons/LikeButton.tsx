import { ThumbsUp } from "lucide-react";
import React from "react";

const LikeButton: React.FC<{ likeCount: number }> = ({ likeCount }) => {
  return (
    <div>
      <button className="text-xs flex items-center space-x-2 bg-white rounded-2xl border border-gray-300 px-3 py-1 font-semibold cursor-pointer text-[var(--green-button-color)] transition-colors duration-300 hover:bg-[#27a743] hover:text-white">
        <ThumbsUp size={15} />
        <span className="text-xs">{likeCount}</span>
      </button>
    </div>
  );
};

export default LikeButton;
