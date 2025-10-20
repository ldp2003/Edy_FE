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
    <div className="flex text-left w-full gap-4 justify-between px-2 py-1 border rounded-lg shadow-md bg-white mb-2">
      <div className="flex items-center">
        <div className="icon bg-[var(--primary-color)] text-white p-2 rounded-full mr-4">
          <FileText size={24} />
        </div>
        <div>
          <div className="item-title font-bold text-sm text-gray-800">
            {title}
          </div>
          <div className="flex flex-row text-sm text-gray-600 gap-2">
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
      <div className="flex flex-col text-right">
        <span className="text-xs text-[var(--secondary-text-color)] mr-4">
          {date instanceof Date ? date.toLocaleDateString() : date}
        </span>
        {intensive && <IntensiveMark label="Chuyên sâu"></IntensiveMark>}
      </div>
    </div>
  );
};

export default SharedItem;
