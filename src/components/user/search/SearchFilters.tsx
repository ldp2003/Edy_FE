/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Select, InputNumber, Button } from "antd";
import { RotateCcw } from "lucide-react";
import type { SearchFilters as ISearchFilters } from "../../../pages/user/search/SearchPage";

const { Option } = Select;

interface SearchFiltersProps {
  filters: ISearchFilters;
  onFilterChange: (filters: ISearchFilters) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleFilterChange = (key: keyof ISearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({ search: filters.search }); // Keep search query
  };

  const hasActiveFilters = () => {
    const filterKeys = Object.keys(filters).filter(
      (key) => key !== "search" && key !== "ordering" && key !== "order"
    );
    return filterKeys.length > 0;
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
            value={filters.doc_type}
            onChange={(value) => handleFilterChange("doc_type", value)}
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
            value={filters.level}
            onChange={(value) => handleFilterChange("level", value)}
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
            value={filters.organization}
            onChange={(value) => handleFilterChange("organization", value)}
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
            value={filters.intensive}
            onChange={(value) => handleFilterChange("intensive", value)}
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
            value={filters.published_year}
            onChange={(value) => handleFilterChange("published_year", value)}
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
            value={filters.publisher}
            onChange={(value) => handleFilterChange("publisher", value)}
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
            value={filters.public_mode}
            onChange={(value) => handleFilterChange("public_mode", value)}
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
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            allowClear
            className="w-full"
            size="small"
          >
            <Option value="APPROVED">Đã duyệt</Option>
            <Option value="PENDING">Chờ duyệt</Option>
            <Option value="REJECTED">Từ chối</Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
