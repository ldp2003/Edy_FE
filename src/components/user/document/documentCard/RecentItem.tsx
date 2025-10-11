import React from "react";
import { FileText } from "lucide-react";
import ViewCount from "../documentElement/ViewCount";
import RatingRatio from "../documentElement/RatingRatio";
import PageCount from "../documentElement/PageCount";
import IntensiveMark from "../documentElement/IntensiveMark";
import type { ReactNode } from "react";


type RecentItemProps = {
  title: string | ReactNode;
  views: number;
  rating: number;
  pages: number;
  date: Date | string;
  intensive?: boolean;
};

const RecentItem: React.FC<RecentItemProps> = ({
  title,
  views,
  rating,
  pages,
  date,
  intensive,
}) => {
  return (
    <div className="flex text-left w-full gap-4 justify-between px-2 py-1 border rounded-lg shadow-md bg-white mb-2">
      <div className="flex items-center">
        <div className="icon bg-blue-500 text-white p-2 rounded-full mr-4">
          <FileText size={24} />
        </div>
        <div>
          <div className="item-title font-bold text-sm text-gray-800">
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
      <div className="flex flex-col text-right">
        <span className="text-xs text-[var(--secondary-text-color)] mr-4">
          {date instanceof Date ? date.toLocaleDateString() : date}
        </span>
        {intensive && <IntensiveMark label="Chuyên sâu"></IntensiveMark>}
      </div>
    </div>
  );
};

export default RecentItem;
