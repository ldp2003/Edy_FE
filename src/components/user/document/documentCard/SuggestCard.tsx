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
      className="cursor-pointer hover:bg-gray-200 rounded-lg mb-2 flex flex-row gap-2"
      onClick={onClick}
    >
      <div
        className="relative w-1/3 rounded-lg p-1 h-fit flex justify-center items-center"
        style={{ backgroundColor: "var(--card-background-color)" }}
      >
        <img
          src={cover_page || "/public/image/default_cover.png"}
          alt={title}
          className="h-16 w-16 object-cover rounded-lg"
          onError={handleImageError}
        />
      </div>
      <div className="flex-1  text-[var(--primary-text-color)]">
        <div className="item-title font-bold text-xs  line-clamp-1">
          {title}
        </div>
        <p className="text-xs mb-2 line-clamp-2">
          {subject?.name || <span>Chưa có môn</span>}
        </p>
        <span className="">
          <LikeCount like={0}></LikeCount>
        </span>
      </div>
    </div>
  );
};

export default SuggestCard;
