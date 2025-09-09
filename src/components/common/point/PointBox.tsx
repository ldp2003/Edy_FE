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
    <div className="p-4 bg-blue-50 rounded-md">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Điểm hạng (RP)</p>
          <p className="text-lg font-bold">{rankPoints}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Điểm tiêu dùng (UP)</p>
          <p className="text-lg font-bold">{usagePoints}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Số lần tải miễn phí (FC)</p>
          <p className="text-lg font-bold">{freeDownloads}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm text-gray-600">Số lần vi phạm (Strike)</p>
          <p className="text-lg font-bold">{violations}</p>
        </div>
      </div>
    </div>
  );
};

export default PointBox;
