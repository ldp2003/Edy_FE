import React from "react";

interface PostsPointBoxProps {
  rankPoints: number;
  usagePoints: number;
  accountType: string;
}

const PostsPointBox: React.FC<PostsPointBoxProps> = ({
  rankPoints,
  usagePoints,
  accountType,
}) => {
  return (
    <div className="p-4 bg-white w-[30%] rounded-md text-left shadow-md ">
      <div className="flex flex-col justify-between text-left gap-2">
        <div className="flex flex-row justify-between">
          <p className="text-sm text-gray-600">Điểm hạng (RP)</p>
          <p className="text-base font-bold">{rankPoints}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-sm text-gray-600">Điểm tiêu dùng (UP)</p>
          <p className="text-base font-bold">{usagePoints}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-sm text-gray-600">Tài khoản</p>
          <p className="text-base font-bold text-[#2DCD21]">{accountType}</p>
        </div>
      </div>
      <div
        className="text-right mt-4 border-t-[0.5px] pt-4"
        style={{ borderColor: "var(--secondary-text-color)" }}
      >
        <a href="#" className=" text-sm" style={{ color: "var(--link-color)" }}>
          Tìm hiểu thêm &gt;
        </a>
      </div>
    </div>
  );
};

export default PostsPointBox;
