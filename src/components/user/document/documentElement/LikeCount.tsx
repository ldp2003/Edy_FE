import React from "react";
import { ThumbsUp } from "lucide-react";

type LikeCountProps = {
  like: number;
};

const LikeCount: React.FC<LikeCountProps> = ({ like }) => {
  return (
    <div
      className="flex items-center bg-blue-100  rounded-full px-4 py-[2px] text-xs font-bold w-full text-center justify-center"
      style={{ color: "var(--primary-text-color)" }}
    >
      <ThumbsUp className="mr-2" size={16} />
      <span>{like} lượt thích</span>
    </div>
  );
};

export default LikeCount;
