import React from "react";
import { FileText } from "lucide-react";
import ViewCount from "../documentElement/ViewCount";
import RatingRatio from "../documentElement/RatingRatio";
import PageCount from "../documentElement/PageCount";
import IntensiveMark from "../documentElement/IntensiveMark";
import FileType from "../documentElement/FileType";
import type { ReactNode } from "react";

type RecentItemProps = {
  title: string | ReactNode;
  views: number;
  rating: number;
  pages: number;
  date: Date | string;
  intensive?: boolean;
  fileType?: string;
};

const RecentItem: React.FC<RecentItemProps> = ({
  title,
  views,
  rating,
  pages,
  date,
  intensive,
  fileType,
}) => {
  return (
    <div className="flex flex-col md:flex-row text-left w-full gap-2 md:gap-4 justify-between px-2 py-1 rounded-lg shadow-md bg-white mb-2 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 cursor-pointer">
      <div className="flex items-start md:items-center w-full md:w-auto">
        <div className="icon bg-[var(--primary-color)] text-white p-2 rounded-full mr-2 md:mr-4 flex-shrink-0">
          <FileText size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="item-title font-bold text-sm text-gray-800 break-words"
            title={title as string}
          >
            {title}
          </div>
          <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mt-1">
            <span>
              <ViewCount count={views}></ViewCount>
            </span>
            <span>
              <RatingRatio rating={rating}></RatingRatio>
            </span>
            <span>
              <PageCount pages={pages}></PageCount>
            </span>
            {fileType && (
              <span>
                <FileType fileType={fileType}></FileType>
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end md:text-right flex-shrink-0">
        <span className="text-xs text-[var(--secondary-text-color)]">
          {date instanceof Date ? date.toLocaleDateString() : date}
        </span>
        {intensive && (
          <div className="md:mt-1">
            <IntensiveMark label="Chuyên sâu"></IntensiveMark>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentItem;
