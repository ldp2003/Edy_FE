import React from "react";
import { ThumbsUp } from "lucide-react";

type RatingRatioProps = {
  rating: number;
};

const RatingRatio: React.FC<RatingRatioProps> = ({ rating }) => {
  // Định nghĩa màu sắc cho từng mức đánh giá
  const getRatingColor = (rating: number) => {
    if (rating >= 80) {
      return "bg-green-100 text-green-700"; // Xuất sắc
    } else if (rating >= 60) {
      return "bg-yellow-100 text-yellow-700"; // Tốt
    } else if (rating >= 40) {
      return "bg-orange-100 text-orange-700"; // Trung bình
    } else if (rating >= 20) {
      return "bg-red-100 text-red-700"; // Kém
    } else {
      return "bg-gray-100 text-gray-700"; // Rất kém
    }
  };

  return (
    <div
      className={`flex items-center justify-center ${getRatingColor(
        rating
      )} rounded-full px-4 py-[1px] text-[10px] font-bold w-fit mx-auto`}
    >
      <ThumbsUp size={12} />
      <span className="ml-2 align-middle">Đánh giá {rating}%</span>
    </div>
  );
};

export default RatingRatio;
