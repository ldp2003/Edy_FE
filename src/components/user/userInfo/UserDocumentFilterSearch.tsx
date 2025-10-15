import React, { useState, useCallback } from "react";
import { Input, Button, Tag } from "antd";
import { Search, Filter, RotateCcw } from "lucide-react";
import CommonFilterDrawer from "../../common/filter/CommonFilterDrawer";
import type { FilterField } from "../../common/filter/CommonFilterDrawer";

export interface UserDocumentFilterParams {
  search?: string;
  doc_type?: string;
  level?: string;
  published_year?: number;
  ordering?: string;
  order?: 1 | -1;
}

interface UserDocumentFilterSearchProps {
  onFilterChange: (params: UserDocumentFilterParams) => void;
  loading?: boolean;
}

const UserDocumentFilterSearch: React.FC<UserDocumentFilterSearchProps> = ({
  onFilterChange,
  loading,
}) => {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<UserDocumentFilterParams>({});
  const [tempFilters, setTempFilters] = useState<UserDocumentFilterParams>({});
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const handleSearch = () => {
    const updatedFilters = { ...tempFilters, search: searchText };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleTempFilterChange = useCallback(
    (newFilters: Partial<UserDocumentFilterParams>) => {
      setTempFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const handleReset = () => {
    setSearchText("");
    setFilters({});
    setTempFilters({});
    onFilterChange({});
    setShowFilterDrawer(false);
  };

  const handleApplyFilter = () => {
    const updatedFilters = { ...tempFilters, search: searchText };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
    setShowFilterDrawer(false);
  };

  const handleOpenDrawer = () => {
    setTempFilters(filters);
    setShowFilterDrawer(true);
  };

  const filterFields: FilterField[] = [
    {
      type: "select",
      key: "doc_type",
      label: "Loại tài liệu",
      placeholder: "Chọn loại tài liệu",
      value: tempFilters.doc_type || null,
      options: [
        { value: "RESEARCH_REPORT", label: "Nghiên cứu" },
        { value: "VIDEO", label: "Video" },
        { value: "STUDY_GUIDE", label: "Đề cương" },
        { value: "TEXTBOOK", label: "Giáo trình" },
        { value: "ESSAY", label: "Tiểu luận" },
        { value: "SOLUTION_SET", label: "Bài giải" },
        { value: "THESIS", label: "Luận văn" },
        { value: "LECTURE", label: "Bài giảng" },
        { value: "OTHER", label: "Khác" },
      ],
      onChange: (value) =>
        handleTempFilterChange({ doc_type: value as string }),
    },
    {
      type: "select",
      key: "level",
      label: "Cấp độ",
      placeholder: "Chọn cấp độ",
      value: tempFilters.level || null,
      options: [
        { value: "STUDENT", label: "Sinh viên" },
        { value: "GRADUATE", label: "Tốt nghiệp" },
        { value: "MASTER", label: "Thạc sĩ" },
        { value: "DOCTOR", label: "Tiến sĩ" },
        { value: "PROFESSOR", label: "Giáo sư" },
      ],
      onChange: (value) => handleTempFilterChange({ level: value as string }),
    },
    {
      type: "select",
      key: "ordering",
      label: "Sắp xếp theo",
      placeholder: "Sắp xếp",
      value:
        tempFilters.ordering && tempFilters.order
          ? `${tempFilters.ordering}_${tempFilters.order}`
          : null,
      options: [
        { value: "createdAt_-1", label: "Ngày tạo (Mới nhất)" },
        { value: "createdAt_1", label: "Ngày tạo (Cũ nhất)" },
        { value: "title_1", label: "Tên tài liệu (A-Z)" },
        { value: "title_-1", label: "Tên tài liệu (Z-A)" },
        { value: "view_-1", label: "Lượt xem (Cao nhất)" },
        { value: "view_1", label: "Lượt xem (Thấp nhất)" },
      ],
      onChange: (value) => {
        if (value) {
          const [ordering, order] = (value as string).split("_");
          handleTempFilterChange({
            ordering,
            order: parseInt(order) as 1 | -1,
          });
        } else {
          handleTempFilterChange({
            ordering: undefined,
            order: undefined,
          });
        }
      },
    },
    {
      type: "select",
      key: "published_year",
      label: "Năm xuất bản",
      placeholder: "Chọn năm xuất bản",
      value: tempFilters.published_year?.toString() || null,
      options: Array.from({ length: 20 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
      }),
      onChange: (value) =>
        handleTempFilterChange({
          published_year: value ? parseInt(value as string) : undefined,
        }),
    },
  ];

  return (
    <>
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên tài liệu, tác giả..."
              prefix={<Search size={16} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              size="middle"
              allowClear
            />
          </div>
          <Button
            type="primary"
            onClick={handleSearch}
            loading={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Search size={16} />
            Tìm kiếm
          </Button>
          <Button
            onClick={handleOpenDrawer}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Bộ lọc
          </Button>
          <Button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Đặt lại
          </Button>
        </div>

        {Object.keys(filters).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.search && (
              <Tag
                closable
                onClose={() => {
                  const newFilters = { ...filters };
                  delete newFilters.search;
                  setFilters(newFilters);
                  setSearchText("");
                  onFilterChange(newFilters);
                }}
              >
                Tìm kiếm: {filters.search}
              </Tag>
            )}
            {filters.doc_type && (
              <Tag
                closable
                onClose={() => {
                  const newFilters = { ...filters };
                  delete newFilters.doc_type;
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
              >
                Loại: {filters.doc_type}
              </Tag>
            )}
            {filters.level && (
              <Tag
                closable
                onClose={() => {
                  const newFilters = { ...filters };
                  delete newFilters.level;
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
              >
                Cấp độ: {filters.level}
              </Tag>
            )}
            {filters.published_year && (
              <Tag
                closable
                onClose={() => {
                  const newFilters = { ...filters };
                  delete newFilters.published_year;
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
              >
                Năm: {filters.published_year}
              </Tag>
            )}
          </div>
        )}
      </div>

      <CommonFilterDrawer
        title="Bộ lọc tài liệu"
        visible={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        onApply={handleApplyFilter}
        onReset={handleReset}
        fields={filterFields}
        loading={loading}
      />
    </>
  );
};

export default UserDocumentFilterSearch;
