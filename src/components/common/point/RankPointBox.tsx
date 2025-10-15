import React from "react";

interface RankPointBoxProps {
  rankPoints: number;
  accountStatus: "Thường" | "VIP";
}

const RankPointBox: React.FC<RankPointBoxProps> = ({
  rankPoints,
  accountStatus,
}) => {
  return (
    <div className="p-4 bg-[var(--field-background-color)] w-full rounded-md text-left shadow-md">
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
    </div>
  );
};

export default RankPointBox;
