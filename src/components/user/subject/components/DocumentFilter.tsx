import React from "react";
import { Search, Filter } from "lucide-react";
import { Input, Select } from "antd";

const { Option } = Select;

interface DocumentFilterProps {
  searchTerm: string;
  sortBy: string;
  filterLevel: string;
  onSearch: (value: string) => void;
  onSortChange: (value: string) => void;
  onLevelChange: (value: string) => void;
}

const DocumentFilter: React.FC<DocumentFilterProps> = ({
  searchTerm,
  sortBy,
  filterLevel,
  onSearch,
  onSortChange,
  onLevelChange,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm tài liệu..."
            prefix={<Search size={16} className="text-gray-400" />}
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            allowClear
            size="large"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <Select
            value={sortBy}
            onChange={onSortChange}
            style={{ width: 140 }}
            size="large"
            suffixIcon={<Filter size={16} />}
          >
            <Option value="newest">Mới nhất</Option>
            <Option value="oldest">Cũ nhất</Option>
            <Option value="title">Tên A-Z</Option>
            <Option value="download">Tải nhiều</Option>
            <Option value="view">Xem nhiều</Option>
          </Select>

          <Select
            value={filterLevel}
            onChange={onLevelChange}
            style={{ width: 120 }}
            size="large"
          >
            <Option value="all">Tất cả</Option>
            <Option value="HIGH_SCHOOL">THPT</Option>
            <Option value="UNIVERSITY">Đại học</Option>
            <Option value="POSTGRADUATE">Sau ĐH</Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DocumentFilter;
