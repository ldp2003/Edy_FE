import React from "react";
import { ThumbsUp } from "lucide-react";

type RatingRatioProps = {
  rating: number;
};

const RatingRatio: React.FC<RatingRatioProps> = ({ rating }) => {
  return (
    <div className="flex items-center bg-blue-100 text-blue-700 rounded-full px-4 py-[1px] text-xs font-bold w-fit">
      <ThumbsUp className="mr-2" size={16} />
      <span>Đánh giá {rating}%</span>
    </div>
  );
};

export default RatingRatio;
