import React, { useState, useEffect } from "react";
import { Input, Button, Select } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import {
  REPORT_TYPE_OPTIONS,
  REPORT_STATUS_OPTIONS,
} from "../../../utils/reportTypeUtils";

export interface AdminReportFilterParams {
  search?: string;
  status?: string;
  type?: string;
}

interface AdminReportFilterSearchProps {
  onFilterChange: (params: AdminReportFilterParams) => void;
  loading?: boolean;
  initialFilters?: AdminReportFilterParams;
}

const { Option } = Select;

const statusOptions = REPORT_STATUS_OPTIONS;
const typeOptions = REPORT_TYPE_OPTIONS;

const AdminReportFilterSearch: React.FC<AdminReportFilterSearchProps> = ({
  onFilterChange,
  loading,
  initialFilters = {},
}) => {
  const [searchText, setSearchText] = useState(initialFilters.search || "");
  const [status, setStatus] = useState(initialFilters.status || "");
  const [type, setType] = useState(initialFilters.type || "");

  useEffect(() => {
    setSearchText(initialFilters.search || "");
    setStatus(initialFilters.status || "");
    setType(initialFilters.type || "");
  }, [initialFilters]);

  const handleApplyFilter = () => {
    const filterParams: AdminReportFilterParams = {};
    if (searchText) filterParams.search = searchText;
    if (status) filterParams.status = status;
    if (type) filterParams.type = type;

    onFilterChange(filterParams);
  };

  const handleReset = () => {
    setSearchText("");
    setStatus("");
    setType("");
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tìm kiếm</label>
          <Input
            placeholder="Tìm kiếm theo lý do, tài liệu, người báo cáo..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="middle"
            allowClear
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Trạng thái</label>
          <Select
            placeholder="Chọn trạng thái"
            style={{ width: "100%" }}
            value={status || undefined}
            onChange={(value) => setStatus(value || "")}
            allowClear
          >
            {statusOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Loại báo cáo</label>
          <Select
            placeholder="Chọn loại báo cáo"
            style={{ width: "100%" }}
            value={type || undefined}
            onChange={(value) => setType(value || "")}
            allowClear
          >
            {typeOptions.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleApplyFilter}
          loading={loading}
        >
          Áp dụng
        </Button>
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
