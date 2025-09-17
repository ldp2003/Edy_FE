import React from "react";
import { ThumbsUp } from "lucide-react";

type RatingRatioProps = {
  rating: number;
};

const RatingRatio: React.FC<RatingRatioProps> = ({ rating }) => {
  return (
    <div className="flex items-center justify-center bg-[var(--third-background-color)] text-[var(--primary-text-color)] rounded-full px-4 py-[1px] text-[10px] font-bold w-fit mx-auto">
      <ThumbsUp size={12} />
      <span className="ml-2 align-middle">Đánh giá {rating}%</span>
    </div>
  );
};

export default RatingRatio;
