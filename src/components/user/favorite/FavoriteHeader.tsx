import React from "react";
import { Button } from "antd";
import { RefreshCw, Grid3X3, List } from "lucide-react";

interface FavoriteHeaderProps {
  documentsCount: number;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onRefresh: () => void;
}

const FavoriteHeader: React.FC<FavoriteHeaderProps> = ({
  documentsCount,
  viewMode,
  onViewModeChange,
  onRefresh,
}) => {
  return (
    <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center text-left justify-start gap-4 sm:gap-0">
      <div className="flex-1">
        <h2 className="text-base sm:text-lg text-left font-bold text-[var(--primary-text-color)] mb-2">
          Tài liệu yêu thích của bạn
        </h2>
        <p className="text-sm text-gray-600">
          Bạn đã lưu {documentsCount} tài liệu vào danh sách yêu thích
        </p>
      </div>

      <div className="flex items-center justify-start space-x-3">
        {/* View Mode Toggle */}
        <div className="flex rounded-md overflow-hidden">
          <Button
            type={viewMode === "grid" ? "primary" : "default"}
            icon={<Grid3X3 size={16} />}
            onClick={() => onViewModeChange("grid")}
            className="rounded-none border-0"
            size="small"
          />
          <Button
            type={viewMode === "list" ? "primary" : "default"}
            icon={<List size={16} />}
            onClick={() => onViewModeChange("list")}
            className="rounded-none border-0 border-l"
            size="small"
          />
        </div>

        <Button icon={<RefreshCw size={16} />} onClick={onRefresh} size="small">
          Làm mới
        </Button>
      </div>
    </div>
  );
};

export default FavoriteHeader;
