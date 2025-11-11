import React from "react";

interface PointBoxProps {
  rankPoints: number | undefined;
  usagePoints: number | undefined;
  freeDownloads: number | undefined;
  violations: number | undefined;
  onViewMore?: () => void;
}

const PointBox: React.FC<PointBoxProps> = ({
  rankPoints,
  usagePoints,
  freeDownloads,
  violations,
  onViewMore,
}) => {
  return (
    <div className="p-3 sm:p-4 bg-[var(--field-background-color)] w-full rounded-md text-left shadow-md">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-[var(--primary-text-color)]">
          Quản lý điểm
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
        className="flex flex-col justify-between text-left gap-2 sm:gap-3"
        style={{ color: "var(--third-text-color)" }}
      >
        <div className="flex justify-between">
          <p className="text-xs sm:text-sm">Điểm hạng (RP)</p>
          <p className="text-xs sm:text-sm font-bold">{rankPoints}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-xs sm:text-sm">Điểm tiêu dùng (UP)</p>
          <p className="text-xs sm:text-sm font-bold">{usagePoints}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-xs sm:text-sm">Số lần tải miễn phí (FC)</p>
          <p className="text-xs sm:text-sm font-bold">{freeDownloads}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-xs sm:text-sm">Số lần vi phạm (Strike)</p>
          <p className="text-xs sm:text-sm font-bold">{violations}</p>
        </div>
      </div>
    </div>
  );
};

export default PointBox;
