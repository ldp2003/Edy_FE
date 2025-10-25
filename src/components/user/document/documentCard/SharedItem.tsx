import React from "react";
import { FileText } from "lucide-react";
import RatingRatio from "../documentElement/RatingRatio";
import PageCount from "../documentElement/PageCount";
import IntensiveMark from "../documentElement/IntensiveMark";
import UserName from "../documentElement/UserName";
import SubjectName from "../documentElement/SubjectName";
import FileType from "../documentElement/FileType";
import type { ReactNode } from "react";

type SharedItemProps = {
  title: string | ReactNode;
  rating: number;
  pages: number;
  date: Date | string;
  intensive?: boolean;
  userName: string;
  subject: string;
  fileType: string;
};

const SharedItem: React.FC<SharedItemProps> = ({
  title,
  rating,
  pages,
  date,
  intensive,
  userName,
  subject,
  fileType,
}) => {
  return (
    <div className="flex flex-col md:flex-row text-center md:text-left w-full gap-2 md:gap-4 justify-center md:justify-between px-2 py-1 border rounded-lg shadow-md bg-white mb-2">
      <div className="flex items-center">
        <div className="icon bg-[var(--primary-color)] text-white p-1 md:p-2 rounded-full mr-2 md:mr-4 flex-shrink-0">
          <FileText size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="item-title font-bold text-xs md:text-sm text-gray-800 truncate">
            {title}
          </div>
          <div className="flex flex-wrap text-xs md:text-sm text-gray-600 gap-1 md:gap-2">
            <span>
              <UserName userName={userName}></UserName>
            </span>
            <span>
              <SubjectName subject={subject}></SubjectName>
            </span>
            <span>
              <FileType fileType={fileType}></FileType>
            </span>
            <span>
              <RatingRatio rating={rating}></RatingRatio>
            </span>
            <span>
              <PageCount pages={pages}></PageCount>
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col text-right md:text-right self-end md:self-center">
        <span className="text-xs text-[var(--secondary-text-color)]">
          {date instanceof Date ? date.toLocaleDateString() : date}
        </span>
        {intensive && <IntensiveMark label="Chuyên sâu"></IntensiveMark>}
      </div>
    </div>
  );
};

export default SharedItem;
