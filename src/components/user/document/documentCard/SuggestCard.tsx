import React from "react";
import LikeCount from "../documentElement/LikeCount";

type SuggestCardProps = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  like: number;
};

const SuggestCard: React.FC<SuggestCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  like,
}) => {
  return (
    <div
      key={id}
      className="cursor-pointer hover:bg-gray-200 rounded-lg mb-2 flex flex-row gap-2"
    >
      <div
        className="relative w-1/3 rounded-lg p-1 h-fit flex justify-center items-center"
        style={{ backgroundColor: "var(--card-background-color)" }}
      >
        <img
          src={imageUrl || "/public/image/thumb_1200_1553.png"}
          alt={title}
          className="h-16 w-full object-cover rounded-lg"
        />
      </div>
      <div className="flex-1">
        <div className="item-title font-semibold text-sm text-gray-800 line-clamp-1">
          {title}
        </div>
        <p className="text-xs mb-2 line-clamp-2 text-gray-600">{description}</p>
        <span className="">
          <LikeCount like={like}></LikeCount>
        </span>
      </div>
    </div>
  );
};

export default SuggestCard;
