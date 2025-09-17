import React from "react";

interface PostsPointBoxProps {
  rankPoints: number;
  usagePoints: number;
  accountType: string;
  loading?: boolean;
}

const PostsPointBox: React.FC<PostsPointBoxProps> = ({
  rankPoints,
  usagePoints,
  accountType,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="w-40 h-24 bg-gray-200 animate-pulse rounded" />
    );
  }
  
  return (
    <div className="p-4 bg-white w-[30%] rounded-md text-left shadow-md ">
      <div className="flex flex-col justify-between text-left gap-2">
        <div className="flex flex-row justify-between">
          <p className="text-xs text-gray-600">Điểm hạng (RP)</p>
          <p className="text-sm font-bold">{rankPoints}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-xs text-gray-600">Điểm tiêu dùng (UP)</p>
          <p className="text-sm font-bold">{usagePoints}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p className="text-xs text-gray-600">Tài khoản</p>
          <p className="text-sm font-bold text-[#2DCD21]">{accountType}</p>
        </div>
      </div>
      <div
        className="text-right mt-4 border-t-[0.5px] pt-4"
        style={{ borderColor: "var(--secondary-text-color)" }}
      >
        <a href="#" className=" text-xs" style={{ color: "var(--link-color)" }}>
          Tìm hiểu thêm &gt;
        </a>
      </div>
    </div>
  );
};

export default PostsPointBox;
