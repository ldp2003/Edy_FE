import React, { useState, useEffect, useCallback } from "react";
import { Input, Button } from "antd";
import { Search, Filter, RotateCcw } from "lucide-react";
import CommonFilterDrawer, {
  type FilterField,
} from "../../common/filter/CommonFilterDrawer";

export interface AdminFilterSearchParams {
  title?: string;
  status?: string;
  doc_type?: string;
  level?: string;
  intensive?: boolean;
  published_year?: number;
  dateRange?: [string, string];
  ordering?: string;
  order?: 1 | -1;
}

interface AdminDocumentFilterSearchProps {
  onFilterChange: (params: AdminFilterSearchParams) => void;
  loading?: boolean;
  initialFilters?: AdminFilterSearchParams;
}

const AdminDocumentFilterSearch: React.FC<AdminDocumentFilterSearchProps> = ({
  onFilterChange,
  loading,
  initialFilters = {},
}) => {
  const [searchText, setSearchText] = useState(initialFilters.title || "");
  const [filters, setFilters] =
    useState<AdminFilterSearchParams>(initialFilters);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Sync with initialFilters when they change (from URL)
  useEffect(() => {
    setFilters(initialFilters);
    setSearchText(initialFilters.title || "");
  }, [initialFilters]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<AdminFilterSearchParams>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange]
  );

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText !== filters.title) {
        handleFilterChange({ title: searchText });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText, filters.title, handleFilterChange]);

  const handleReset = () => {
    setSearchText("");
    setFilters({});
    onFilterChange({});
    setShowFilterDrawer(false);
  };

  const handleApplyFilter = () => {
    setShowFilterDrawer(false);
  };

  // Configure filter fields for the drawer
  const filterFields: FilterField[] = [
    {
      type: "select",
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      value: filters.status || null,
      options: [
        { value: "PENDING", label: "Chờ duyệt" },
        { value: "APPROVED", label: "Đã duyệt" },
        { value: "REJECTED", label: "Bị từ chối" },
        { value: "PENDING_SUMMARY", label: "Chờ tóm tắt" },
        { value: "REQUESTED_EDIT", label: "Yêu cầu chỉnh sửa" },
      ],
      onChange: (value) => handleFilterChange({ status: value as string }),
    },
    {
      type: "select",
      key: "doc_type",
      label: "Loại tài liệu",
      placeholder: "Chọn loại tài liệu",
      value: filters.doc_type || null,
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
      onChange: (value) => handleFilterChange({ doc_type: value as string }),
    },
    {
      type: "select",
      key: "level",
      label: "Trình độ",
      placeholder: "Chọn trình độ",
      value: filters.level || null,
      options: [
        { value: "STUDENT", label: "Học sinh" },
        { value: "UNIVERSITY", label: "Đại học" },
        { value: "LECTURER", label: "Giảng viên" },
        { value: "RESEARCHER", label: "Nghiên cứu sinh" },
        { value: "OTHER", label: "Khác" },
      ],
      onChange: (value) => handleFilterChange({ level: value as string }),
    },
    {
      type: "select",
      key: "intensive",
      label: "Chuyên sâu",
      placeholder: "Chọn",
      value:
        filters.intensive !== undefined ? filters.intensive.toString() : null,
      options: [
        { value: "true", label: "Có" },
        { value: "false", label: "Không" },
      ],
      onChange: (value) =>
        handleFilterChange({
          intensive: value ? value === "true" : undefined,
        }),
    },
    {
      type: "select",
      key: "ordering",
      label: "Sắp xếp theo",
      placeholder: "Sắp xếp",
      value:
        filters.ordering && filters.order
          ? `${filters.ordering}_${filters.order}`
          : null,
      options: [
        { value: "createdAt_-1", label: "Ngày tạo (Mới nhất)" },
        { value: "createdAt_1", label: "Ngày tạo (Cũ nhất)" },
        { value: "title_1", label: "Tên tài liệu (A-Z)" },
        { value: "title_-1", label: "Tên tài liệu (Z-A)" },
        { value: "view_-1", label: "Lượt xem (Cao nhất)" },
        { value: "view_1", label: "Lượt xem (Thấp nhất)" },
        { value: "download_count_-1", label: "Lượt tải (Cao nhất)" },
        { value: "download_count_1", label: "Lượt tải (Thấp nhất)" },
      ],
      onChange: (value) => {
        if (value) {
          const [ordering, order] = (value as string).split("_");
          handleFilterChange({
            ordering,
            order: parseInt(order) as 1 | -1,
          });
        } else {
          handleFilterChange({
            ordering: undefined,
            order: undefined,
          });
        }
      },
    },
    {
      type: "dateRange",
      key: "dateRange",
      label: "Khoảng thời gian tạo",
      value: filters.dateRange,
      onChange: (value) => {
        const dateStrings = value as [string, string];
        if (dateStrings && dateStrings[0] && dateStrings[1]) {
          handleFilterChange({ dateRange: dateStrings });
        } else {
          handleFilterChange({ dateRange: undefined });
        }
      },
    },
    {
      type: "select",
      key: "published_year",
      label: "Năm xuất bản",
      placeholder: "Chọn năm xuất bản",
      value: filters.published_year?.toString() || null,
      options: Array.from({ length: 20 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
      }),
      onChange: (value) =>
        handleFilterChange({
          published_year: value ? parseInt(value as string) : undefined,
        }),
    },
  ];

  // Get filter label for display
  const getFilterLabel = (
    key: string,
    value: string | number | boolean
  ): string => {
    const field = filterFields.find((f) => f.key === key);
    if (!field || !field.options) return String(value);

    const option = field.options.find(
      (opt) => opt.value === value || opt.value === String(value)
    );
    return option ? option.label : String(value);
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        {/* Search Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên tài liệu..."
              prefix={<Search size={16} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="middle"
              allowClear
            />
          </div>
          <Button
            icon={<Filter size={16} />}
            onClick={() => setShowFilterDrawer(true)}
            type={Object.keys(filters).length > 1 ? "primary" : "default"}
          >
            Bộ lọc
          </Button>
          <Button
            icon={<RotateCcw size={16} />}
            onClick={handleReset}
            disabled={loading}
          >
            Đặt lại
          </Button>
        </div>

        {/* Filter Summary */}
        {Object.keys(filters).length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600">
                Đang lọc:
              </span>
              {filters.title && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Tìm kiếm: "{filters.title}"
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Trạng thái: {getFilterLabel("status", filters.status)}
                </span>
              )}
              {filters.doc_type && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Loại: {getFilterLabel("doc_type", filters.doc_type)}
                </span>
              )}
              {filters.level && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Trình độ: {getFilterLabel("level", filters.level)}
                </span>
              )}
              {filters.intensive !== undefined && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Chuyên sâu: {filters.intensive ? "Có" : "Không"}
                </span>
              )}
              {filters.published_year && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  Năm: {filters.published_year}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter Drawer */}
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

export default AdminDocumentFilterSearch;
