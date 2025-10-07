import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, Select } from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";

export interface AdminReportFilterParams {
  reason?: string;
  status?: string;
  type?: string;
  reporter?: string;
  docTitle?: string;
}

interface AdminReportFilterSearchProps {
  onFilterChange: (params: AdminReportFilterParams) => void;
  loading?: boolean;
  initialFilters?: AdminReportFilterParams;
}

const { Option } = Select;

const statusOptions = [
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "RESOLVED", label: "Đã xử lý" },
];

const typeOptions = [
  { value: "SPAM_OR_MISLEADING", label: "Spam/Tin giả" },
  { value: "DUPLICATE", label: "Trùng lặp" },
  { value: "COPYRIGHT", label: "Bản quyền" },
  { value: "INCORRECT_CATEGORY", label: "Sai danh mục" },
  { value: "PERSONAL_INFORMATION", label: "Thông tin cá nhân" },
  { value: "LOW_QUALITY", label: "Chất lượng thấp" },
  { value: "INAPPROPRIATE", label: "Không phù hợp" },
  { value: "OTHER", label: "Khác" },
];

const AdminReportFilterSearch: React.FC<AdminReportFilterSearchProps> = ({
  onFilterChange,
  loading,
  initialFilters = {},
}) => {
  const [searchText, setSearchText] = useState(initialFilters.reason || "");
  const [filters, setFilters] =
    useState<AdminReportFilterParams>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
    setSearchText(initialFilters.reason || "");
  }, [initialFilters]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<AdminReportFilterParams>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange]
  );

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText !== filters.reason) {
        handleFilterChange({ reason: searchText });
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText, filters.reason, handleFilterChange]);

  const handleReset = () => {
    setSearchText("");
    setFilters({});
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm lý do báo cáo..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="middle"
            allowClear
          />
        </div>
        <Select
          placeholder="Trạng thái"
          style={{ minWidth: 120 }}
          value={filters.status}
          onChange={(value) => handleFilterChange({ status: value })}
          allowClear
        >
          {statusOptions.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Loại báo cáo"
          style={{ minWidth: 140 }}
          value={filters.type}
          onChange={(value) => handleFilterChange({ type: value })}
          allowClear
        >
          {typeOptions.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleReset}
          disabled={loading}
        >
          Đặt lại
        </Button>
      </div>
    </div>
  );
};

export default AdminReportFilterSearch;
