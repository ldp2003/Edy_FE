import React, { useState, useEffect, useCallback } from "react";
import { Input, Button } from "antd";
import { Search, Filter, RotateCcw } from "lucide-react";
import CommonFilterDrawer, {
  type FilterField,
} from "../../common/filter/CommonFilterDrawer";

export interface FilterSearchParams {
  search?: string;
  status?: string;
  doc_type?: string;
  public_mode?: string;
  published_year?: number;
  dateRange?: [string, string];
  ordering?: string;
  order?: 1 | -1;
}

interface PostFilterSearchProps {
  onFilterChange: (params: FilterSearchParams) => void;
  loading?: boolean;
}

const PostFilterSearch: React.FC<PostFilterSearchProps> = ({
  onFilterChange,
  loading,
}) => {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState<FilterSearchParams>({});
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const handleFilterChange = useCallback(
    (newFilters: Partial<FilterSearchParams>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [filters, onFilterChange]
  );

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText !== filters.search) {
        handleFilterChange({ search: searchText });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchText, filters.search, handleFilterChange]);

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
        { value: "EDIT_REQUESTED", label: "Yêu cầu chỉnh sửa" },
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
        { value: "RESEARCH_REPORT", label: "Báo cáo nghiên cứu" },
        { value: "TEXTBOOK", label: "Giáo trình" },
        { value: "LECTURE", label: "Bài giảng" },
        { value: "THESIS", label: "Luận văn" },
        { value: "VIDEO", label: "Video" },
        { value: "OTHER", label: "Khác" },
      ],
      onChange: (value) => handleFilterChange({ doc_type: value as string }),
    },
    {
      type: "select",
      key: "public_mode",
      label: "Chế độ công khai",
      placeholder: "Chọn chế độ",
      value: filters.public_mode || null,
      options: [
        { value: "PUBLIC", label: "Công khai" },
        { value: "PRIVATE", label: "Riêng tư" },
        { value: "PRIVATE_SHARED", label: "Chia sẻ riêng tư" },
        { value: "SHARE_ORGANIZATION", label: "Chia sẻ tổ chức" },
      ],
      onChange: (value) => handleFilterChange({ public_mode: value as string }),
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

  return (
    <>
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
        {/* Search Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên tài liệu, tác giả..."
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
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Tìm kiếm: "{filters.search}"
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Trạng thái: {filters.status}
                </span>
              )}
              {filters.doc_type && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Loại: {filters.doc_type}
                </span>
              )}
              {filters.public_mode && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Chế độ: {filters.public_mode}
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

export default PostFilterSearch;
