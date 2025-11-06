import React from "react";
import LikeCount from "../documentElement/LikeCount";
import type { Document } from "../../../../models/document";

type SuggestCardProps = {
  document: Document;
};

const SuggestCard: React.FC<SuggestCardProps> = ({ document }) => {
  const { _id, title, subject, cover_page } = document;
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/public/image/default_cover.png";
  };

  const onClick = () => {
    window.location.href = `/document-detail/${_id}`;
  };
  return (
    <div
      key={_id}
      className="cursor-pointer hover:bg-gray-200 rounded-lg mb-2 flex flex-row gap-3 p-2 border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="relative w-15 h-15 md:w-18 md:h-18 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--secondary-background-color)]">
        <img
          src={cover_page || "/public/image/default_cover.png"}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        {/* Badge Chuyên sâu */}
        {document.intensive && (
          <div className="absolute top-0 left-0 px-1.5 py-0.5 text-[8px] font-bold rounded-br-lg bg-white/95 text-[var(--intensive-color)] border-r border-b border-[var(--intensive-color)]">
            CS
          </div>
        )}
      </div>
      <div className="flex-1 text-[var(--primary-text-color)] min-w-0">
        <div
          className="item-title font-bold text-xs line-clamp-2 mb-1"
          title={title}
        >
          {title}
        </div>
        <p
          className="text-xs text-[var(--secondary-text-color)] mb-2 line-clamp-1"
          title={subject?.name || "Chưa có môn"}
        >
          {subject?.name || <span>Chưa có môn</span>}
        </p>
        <div className="flex items-center justify-between">
          <LikeCount like={0}></LikeCount>
        </div>
      </div>
    </div>
  );
};

export default SuggestCard;
