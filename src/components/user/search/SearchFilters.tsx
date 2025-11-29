/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Select, InputNumber, Button, Input } from "antd";
import { RotateCcw } from "lucide-react";
import { OrganizationService } from "../../../utils/OrganizationService";
import type { SearchFilters as ISearchFilters } from "../../../pages/user/search/SearchPage";
import type { OrganizationDetailed } from "../../../models/organization";

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
  const [organizations, setOrganizations] = useState<OrganizationDetailed[]>(
    []
  );
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  // Sync temp filters when props change
  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  // Fetch organizations on component mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoadingOrgs(true);
      try {
        // Thử lấy organizations có is_dropdown = true trước
        let orgList = await OrganizationService.getDropdownOrganizations();

        // Nếu không có data hoặc empty, fallback về tất cả organizations
        if (!orgList || orgList.length === 0) {
          console.log(
            "No dropdown organizations found, fetching all organizations"
          );
          orgList = await OrganizationService.getOrganizations();
        }

        setOrganizations(orgList);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
        // Fallback: thử lấy tất cả organizations
        try {
          const allOrgs = await OrganizationService.getOrganizations();
          setOrganizations(allOrgs);
        } catch (fallbackError) {
          console.error(
            "Failed to fetch fallback organizations:",
            fallbackError
          );
          setOrganizations([]);
        }
      } finally {
        setLoadingOrgs(false);
      }
    };

    fetchOrganizations();
  }, []);

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
          <span className="text-sm text-[var(--secondary-text-color)]">
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
            className="text-[var(--red-button-color)] hover:text-[var(--red-button-color)]"
          >
            Xóa tất cả
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {/* Loại tài liệu */}
        <div>
          <label className="block text-sm font-medium text-[var(--primary-text-color)] mb-1">
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
          <label className="block text-sm font-medium text-[var(--primary-text-color)] mb-1">
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
          <label className="block text-sm font-medium text-[var(--primary-text-color)] mb-1">
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
            loading={loadingOrgs}
            notFoundContent={loadingOrgs ? "Đang tải..." : "Không có dữ liệu"}
          >
            {organizations.map((org) => (
              <Option key={org._id} value={org._id}>
                {org.name}
              </Option>
            ))}
          </Select>
        </div>

        {/* Tác giả */}
        <div>
          <label className="block text-sm font-medium text-[var(--primary-text-color)] mb-1">
            Tên tác giả
          </label>
          <Input
            placeholder="Nhập tên tác giả"
            value={
              Array.isArray(tempFilters.author)
                ? tempFilters.author.join(", ")
                : tempFilters.author || ""
            }
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                // Split by comma and trim whitespace
                const authors = value
                  .split(",")
                  .map((author) => author.trim())
                  .filter((author) => author);
                handleTempFilterChange(
                  "author",
                  authors.length > 0 ? authors : undefined
                );
              } else {
                handleTempFilterChange("author", undefined);
              }
            }}
            size="small"
            allowClear
          />
          <p className="text-xs text-[var(--third-text-color)] mt-1">
            Nhập nhiều tác giả cách nhau bằng dấu phẩy
          </p>
        </div>

        {/* Lượt xem */}
        <div>
          <label className="block text-sm font-medium text-[var(--primary-text-color)] mb-1">
            Lượt xem tối thiểu
          </label>
          <InputNumber
            placeholder="Số lượt xem"
            value={tempFilters.view_count}
            onChange={(value) => handleTempFilterChange("view_count", value)}
            className="w-full"
            size="small"
            min={0}
          />
        </div>

        {/* Lượt tải */}
        <div>
          <label className="block text-sm font-medium text-[var(--primary-text-color)] mb-1">
            Lượt tải tối thiểu
          </label>
          <InputNumber
            placeholder="Số lượt tải"
            value={tempFilters.download_count}
            onChange={(value) =>
              handleTempFilterChange("download_count", value)
            }
            className="w-full"
            size="small"
            min={0}
          />
        </div>

        {/* Tài liệu chuyên sâu */}
        <div>
          <label className="block text-sm font-medium text-[var(--primary-text-color)] mb-1">
            Chuyên sâu
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="intensive"
              checked={tempFilters.intensive === true}
              onChange={(e) =>
                handleTempFilterChange(
                  "intensive",
                  e.target.checked ? true : undefined
                )
              }
              className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-[var(--border-color)] rounded"
            />
            <label
              htmlFor="intensive"
              className="ml-2 text-sm text-[var(--primary-text-color)]"
            >
              Chỉ hiển thị tài liệu chuyên sâu
            </label>
          </div>
        </div>

        {/* Năm xuất bản */}
        <div>
          <label className="block text-sm font-medium text-[var(--primary-text-color)] mb-1">
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

        {/* Số trang */}
        <div>
          <label className="block text-sm font-medium text-[var(--primary-text-color)] mb-1">
            Số trang
          </label>
          <InputNumber
            placeholder="Số trang"
            value={tempFilters.page}
            onChange={(value) => handleTempFilterChange("page", value)}
            className="w-full"
            size="small"
            min={1}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
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
            className="flex-1 bg-[var(--primary-color)] hover:bg-[var(--secondary-color)]"
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
