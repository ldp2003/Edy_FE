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
    <div key={id} className="cursor-pointer hover:bg-gray-200 rounded-lg mb-4 flex flex-row gap-2">
      <div
        className="relative w-2/5 rounded-lg p-2 h-fit flex justify-center items-center"
        style={{ backgroundColor: "var(--card-background-color)" }}
      >
        <img
          src={imageUrl || "/public/image/thumb_1200_1553.png"}
          alt={title}
          className="h-24 w-full object-cover rounded-lg"
        />
      </div>
      <div>
        <div className="item-title font-bold text-lg text-gray-800">
          {title}
        </div>
        <p className="text-[14px] mb-3 line-clamp-2">{description}</p>
        <span className="">
          <LikeCount like={like}></LikeCount>
        </span>
      </div>
    </div>
  );
};

export default SuggestCard;
