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
    <div className="p-4 bg-blue-50 rounded-md">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Điểm hạng (RP)</p>
          <p className="text-lg font-bold">{rankPoints}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Điểm tiêu dùng (UP)</p>
          <p className="text-lg font-bold">{usagePoints}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Tài khoản</p>
          <p className="text-lg font-bold text-green-600">{accountType}</p>
        </div>
      </div>
      <div className="text-right mt-2">
        <a href="#" className="text-blue-500 text-sm">
          Tìm hiểu thêm &gt;
        </a>
      </div>
    </div>
  );
};

export default PostsPointBox;
