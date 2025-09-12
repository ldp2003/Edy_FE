import React from "react";
import { FileText } from "lucide-react";
import ViewCount from "../documentElement/ViewCount";
import RatingRatio from "../documentElement/RatingRatio";
import PageCount from "../documentElement/PageCount";
import IntensiveMark from "../documentElement/IntensiveMark";

type RecentItemProps = {
  title: string;
  views: number;
  rating: number;
  pages: number;
  date: string;
};

const RecentItem: React.FC<RecentItemProps> = ({
  title,
  views,
  rating,
  pages,
  date,
}) => {
  return (
    <div className="flex text-left w-full gap-4 justify-between px-2 py-1 border rounded-lg shadow-md bg-white mb-2">
      <div className="flex items-center">
        <div className="icon bg-blue-500 text-white p-2 rounded-full mr-4">
          <FileText size={24} />
        </div>
        <div>
          <div className="item-title font-bold text-lg text-gray-800">
            {title}
          </div>
          <div className="flex flex-row text-sm text-gray-600">
            <span className="mr-4">
              <ViewCount count={views}></ViewCount>
            </span>
            <span className="mr-4">
              <RatingRatio rating={rating}></RatingRatio>
            </span>
            <span>
              <PageCount pages={pages}></PageCount>
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-500 mr-4">{date}</span>
        <IntensiveMark label="Chuyên sâu"></IntensiveMark>
      </div>
    </div>
  );
};

export default RecentItem;
