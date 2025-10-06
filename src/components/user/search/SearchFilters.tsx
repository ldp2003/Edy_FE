/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Select, InputNumber, Button } from "antd";
import { RotateCcw } from "lucide-react";
import type { SearchFilters as ISearchFilters } from "../../../pages/user/search/SearchPage";

const { Option } = Select;

interface SearchFiltersProps {
  filters: ISearchFilters;
  onFilterChange: (filters: ISearchFilters) => void;
  onApply?: () => void;
  onReset?: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  onApply,
  onReset,
}) => {
  const [tempFilters, setTempFilters] = useState<ISearchFilters>(filters);

  // Sync temp filters when props change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleTempFilterChange = (key: keyof ISearchFilters, value: any) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFilterChange(tempFilters);
    if (onApply) onApply();
  };

  const clearAllFilters = () => {
    const resetFilters = { search: filters.search }; // Keep search query
    setTempFilters(resetFilters);
    onFilterChange(resetFilters);
    if (onReset) onReset();
  };

  const hasActiveFilters = () => {
    const filterKeys = Object.keys(tempFilters).filter(
      (key) => key !== "search" && key !== "ordering" && key !== "order"
    );
    return filterKeys.length > 0;
  };

  const hasUnsavedChanges = () => {
    return JSON.stringify(tempFilters) !== JSON.stringify(filters);
  };

  return (
    <div className="space-y-4">
      {/* Clear filters button */}
      {hasActiveFilters() && (
        <div className="flex justify-between items-center pb-4 border-b">
          <span className="text-sm text-gray-600">
            {
              Object.keys(filters).filter(
                (key) =>
                  key !== "search" && key !== "ordering" && key !== "order"
              ).length
            }{" "}
            bộ lọc đang áp dụng
          </span>
          <Button
            type="text"
            size="small"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={clearAllFilters}
            className="text-red-500 hover:text-red-700"
          >
            Xóa tất cả
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {/* Loại tài liệu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại tài liệu
          </label>
          <Select
            placeholder="Chọn loại tài liệu"
            value={tempFilters.doc_type}
            onChange={(value) => handleTempFilterChange("doc_type", value)}
            allowClear
            className="w-full"
            size="small"
          >
            <Option value="RESEARCH_REPORT">Nghiên cứu</Option>
            <Option value="VIDEO">Video</Option>
            <Option value="STUDY_GUIDE">Đề cương</Option>
            <Option value="TEXTBOOK">Giáo trình</Option>
            <Option value="ESSAY">Tiểu luận</Option>
            <Option value="SOLUTION_SET">Bài giải</Option>
            <Option value="THESIS">Luận văn</Option>
            <Option value="LECTURE">Bài giảng</Option>
            <Option value="OTHER">Khác</Option>
          </Select>
        </div>

        {/* Trình độ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trình độ
          </label>
          <Select
            placeholder="Chọn trình độ"
            value={tempFilters.level}
            onChange={(value) => handleTempFilterChange("level", value)}
            allowClear
            className="w-full"
            size="small"
          >
            <Option value="STUDENT">Học sinh</Option>
            <Option value="UNIVERSITY">Đại học</Option>
            <Option value="LECTURER">Giảng viên</Option>
            <Option value="RESEARCHER">Nghiên cứu sinh</Option>
            <Option value="OTHER">Khác</Option>
          </Select>
        </div>

        {/* Tổ chức */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tổ chức
          </label>
          <Select
            placeholder="Chọn tổ chức"
            value={tempFilters.organization}
            onChange={(value) => handleTempFilterChange("organization", value)}
            allowClear
            className="w-full"
            size="small"
            showSearch
            optionFilterProp="children"
          >
            <Option value="org1">Đại học Công nghiệp TP.HCM</Option>
            <Option value="org2">Đại học Bách Khoa TP.HCM</Option>
            <Option value="org3">Đại học Khoa học Tự nhiên</Option>
          </Select>
        </div>

        {/* Tài liệu chuyên sâu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tài liệu chuyên sâu
          </label>
          <Select
            placeholder="Tất cả"
            value={tempFilters.intensive}
            onChange={(value) => handleTempFilterChange("intensive", value)}
            allowClear
            className="w-full"
            size="small"
          >
            <Option value={true}>Có</Option>
            <Option value={false}>Không</Option>
          </Select>
        </div>

        {/* Năm xuất bản */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Năm xuất bản
          </label>
          <InputNumber
            placeholder="Năm xuất bản"
            value={tempFilters.published_year}
            onChange={(value) =>
              handleTempFilterChange("published_year", value)
            }
            className="w-full"
            size="small"
            min={1900}
            max={new Date().getFullYear()}
          />
        </div>

        {/* Nhà xuất bản */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhà xuất bản
          </label>
          <Select
            placeholder="Chọn nhà xuất bản"
            value={tempFilters.publisher}
            onChange={(value) => handleTempFilterChange("publisher", value)}
            allowClear
            className="w-full"
            size="small"
            showSearch
            optionFilterProp="children"
          >
            <Option value="NXB Giáo dục Việt Nam">NXB Giáo dục Việt Nam</Option>
            <Option value="NXB Đại học Quốc gia">NXB Đại học Quốc gia</Option>
            <Option value="NXB Khoa học và Kỹ thuật">
              NXB Khoa học và Kỹ thuật
            </Option>
            <Option value="NXB Thông tin và Truyền thông">
              NXB Thông tin và Truyền thông
            </Option>
          </Select>
        </div>

        {/* Chế độ công khai */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chế độ công khai
          </label>
          <Select
            placeholder="Chọn chế độ"
            value={tempFilters.public_mode}
            onChange={(value) => handleTempFilterChange("public_mode", value)}
            allowClear
            className="w-full"
            size="small"
          >
            <Option value="PUBLIC">Công khai</Option>
            <Option value="SHARE_ORGANIZATION">Chia sẻ tổ chức</Option>
            <Option value="PRIVATE">Riêng tư</Option>
            <Option value="PRIVATE_SHARED">Chia sẻ riêng</Option>
          </Select>
        </div>

        {/* Trạng thái duyệt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái duyệt
          </label>
          <Select
            placeholder="Chọn trạng thái"
            value={tempFilters.status}
            onChange={(value) => handleTempFilterChange("status", value)}
            allowClear
            className="w-full"
            size="small"
          >
            <Option value="APPROVED">Đã duyệt</Option>
            <Option value="PENDING">Chờ duyệt</Option>
            <Option value="REJECTED">Từ chối</Option>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={clearAllFilters}
            icon={<RotateCcw className="w-4 h-4" />}
            className="flex-1"
            size="small"
          >
            Đặt lại
          </Button>
          <Button
            type="primary"
            onClick={applyFilters}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            size="small"
            disabled={!hasUnsavedChanges()}
          >
            Áp dụng bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
