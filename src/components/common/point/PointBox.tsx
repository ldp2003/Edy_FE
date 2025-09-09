import React from "react";

interface PointBoxProps {
  rankPoints: number;
  usagePoints: number;
  freeDownloads: number;
  violations: number;
}

const PointBox: React.FC<PointBoxProps> = ({
  rankPoints,
  usagePoints,
  freeDownloads,
  violations,
}) => {
  return (
    <div
      className="p-4  w-[30%] rounded-md text-left shadow-md"
      style={{ backgroundColor: "var( --field-background-color)" }}
    >
      <div
        className="flex flex-col justify-between text-left gap-3"
        style={{ color: "var(--third-text-color)" }}
      >
        <div className="flex justify-between">
          <p className="text-sm">Điểm hạng (RP)</p>
          <p className="text-sm font-bold">{rankPoints}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Điểm tiêu dùng (UP)</p>
          <p className="text-sm font-bold">{usagePoints}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Số lần tải miễn phí (FC)</p>
          <p className="text-sm font-bold">{freeDownloads}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Số lần vi phạm (Strike)</p>
          <p className="text-sm font-bold">{violations}</p>
        </div>
      </div>
    </div>
  );
};

export default PointBox;
