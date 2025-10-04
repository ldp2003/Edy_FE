/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Card,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Row,
  Col,
  Collapse,
  Input,
} from "antd";
import { Filter, RotateCcw } from "lucide-react";
import type { SearchFilters as ISearchFilters } from "../../../pages/user/search/SearchPage";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

interface SearchFiltersProps {
  filters: ISearchFilters;
  onFilterChange: (filters: ISearchFilters) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof ISearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (dates: any) => {
    const newFilters = { ...filters };
    if (dates && dates[0] && dates[1]) {
      newFilters.start_date = dates[0].format("YYYY-MM-DD");
      newFilters.end_date = dates[1].format("YYYY-MM-DD");
    } else {
      delete newFilters.start_date;
      delete newFilters.end_date;
    }
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
    <Card
      className="mb-6"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span>Bộ lọc tìm kiếm</span>
            {hasActiveFilters() && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {
                  Object.keys(filters).filter(
                    (key) =>
                      key !== "search" && key !== "ordering" && key !== "order"
                  ).length
                }
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <Button
                type="text"
                size="small"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={clearAllFilters}
              >
                Xóa bộ lọc
              </Button>
            )}
            <Button
              type="text"
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Thu gọn" : "Mở rộng"}
            </Button>
          </div>
        </div>
      }
      size="small"
    >
      <Collapse
        activeKey={isExpanded ? "filters" : []}
        ghost
        onChange={(keys) => setIsExpanded(keys.includes("filters"))}
      >
        <Panel key="filters" header="" showArrow={false}>
          <Row gutter={[16, 16]}>
            {/* Loại tài liệu */}
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
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
            </Col>

            {/* Trình độ */}
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
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
            </Col>

            {/* Tổ chức */}
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tổ chức
                </label>
                <Select
                  placeholder="Chọn tổ chức"
                  value={filters.organization}
                  onChange={(value) =>
                    handleFilterChange("organization", value)
                  }
                  allowClear
                  className="w-full"
                  size="small"
                  showSearch
                  optionFilterProp="children"
                >
                  {/* TODO: Load từ API */}
                  <Option value="org1">Đại học Công nghiệp TP.HCM</Option>
                  <Option value="org2">Đại học Bách Khoa TP.HCM</Option>
                  <Option value="org3">Đại học Khoa học Tự nhiên</Option>
                </Select>
              </div>
            </Col>

            {/* Tài liệu chuyên sâu */}
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
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
            </Col>

            {/* Ngày đăng */}
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ngày đăng
                </label>
                <RangePicker
                  placeholder={["Từ ngày", "Đến ngày"]}
                  onChange={handleDateRangeChange}
                  className="w-full"
                  size="small"
                  format="DD/MM/YYYY"
                />
              </div>
            </Col>

            {/* Năm xuất bản */}
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Năm xuất bản
                </label>
                <InputNumber
                  placeholder="Năm xuất bản"
                  value={filters.published_year}
                  onChange={(value) =>
                    handleFilterChange("published_year", value)
                  }
                  className="w-full"
                  size="small"
                  min={1900}
                  max={new Date().getFullYear()}
                />
              </div>
            </Col>

            {/* Lượt xem */}
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Lượt xem
                </label>
                <Input.Group compact className="w-full">
                  <InputNumber
                    placeholder="Min"
                    value={filters.min_views}
                    onChange={(value) => handleFilterChange("min_views", value)}
                    className="w-1/2"
                    size="small"
                    min={0}
                  />
                  <InputNumber
                    placeholder="Max"
                    value={filters.max_views}
                    onChange={(value) => handleFilterChange("max_views", value)}
                    className="w-1/2"
                    size="small"
                    min={0}
                  />
                </Input.Group>
              </div>
            </Col>

            {/* Lượt tải */}
            <Col xs={24} sm={12} md={6}>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Lượt tải xuống
                </label>
                <Input.Group compact className="w-full">
                  <InputNumber
                    placeholder="Min"
                    value={filters.min_downloads}
                    onChange={(value) =>
                      handleFilterChange("min_downloads", value)
                    }
                    className="w-1/2"
                    size="small"
                    min={0}
                  />
                  <InputNumber
                    placeholder="Max"
                    value={filters.max_downloads}
                    onChange={(value) =>
                      handleFilterChange("max_downloads", value)
                    }
                    className="w-1/2"
                    size="small"
                    min={0}
                  />
                </Input.Group>
              </div>
            </Col>
          </Row>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default SearchFilters;
