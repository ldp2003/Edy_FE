import React from "react";
import { useNavigate } from "react-router-dom";

interface RankPointBoxProps {
  rankPoints: number;
  accountStatus: "Thường" | "VIP";
  onViewMore?: () => void;
}

const RankPointBox: React.FC<RankPointBoxProps> = ({
  rankPoints,
  accountStatus,
  onViewMore,
}) => {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/point-management");
  };
  return (
    <div className="p-4 bg-[var(--field-background-color)] w-[30%] rounded-md text-left shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-[var(--primary-text-color)]">
          Xếp hạng
        </h3>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="text-xs text-[var(--link-color)] hover:underline cursor-pointer"
          >
            Xem thêm &gt;
          </button>
        )}
      </div>

      <div
        className="flex flex-col justify-between text-left gap-3"
        style={{ color: "var(--third-text-color)" }}
      >
        <div className="flex justify-between">
          <p className="text-xs">Điểm hạng (RP)</p>
          <p className="text-xs font-bold">{rankPoints}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-xs">Tài khoản</p>
          <p
            className={`text-xs font-bold ${
              accountStatus === "VIP" ? "text-[#2DCD21]" : "text-gray-600"
            }`}
          >
            {accountStatus}
          </p>
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

export default RankPointBox;
