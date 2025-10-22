import React from "react";
import { useNavigate } from "react-router-dom";

interface PostsPointBoxProps {
  rankPoints: number;
  usagePoints: number;
  accountType: string;
  loading?: boolean;
  onViewMore?: () => void;
}

const PostsPointBox: React.FC<PostsPointBoxProps> = ({
  rankPoints,
  usagePoints,
  accountType,
  loading = false,
  onViewMore,
}) => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/point-management");
  };

  if (loading) {
    return <div className="w-40 h-24 bg-gray-200 animate-pulse rounded" />;
  }

  return (
    <div className="p-4 bg-[var(--field-background-color)] w-full md:w-[30%] rounded-md text-left shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-[var(--primary-text-color)]">
          Điểm của bạn
        </h3>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="text-xs text-[var(--link-color)] hover:underline"
          >
            Xem thêm &gt;
          </button>
        )}
      </div>

      <div className="flex flex-col justify-between text-left">
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
        <button
          onClick={handleViewMore}
          className="text-xs text-[var(--link-color)] hover:underline"
        >
          Tìm hiểu thêm &gt;
        </button>
      </div>
    </div>
  );
};

export default PostsPointBox;
