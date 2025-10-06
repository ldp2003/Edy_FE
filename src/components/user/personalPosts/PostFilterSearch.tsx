import React, { useState, useCallback } from "react";
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
  const [tempFilters, setTempFilters] = useState<FilterSearchParams>({}); // Temporary filters for drawer
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Apply filters manually when search button is clicked
  const handleSearch = () => {
    const updatedFilters = { ...tempFilters, search: searchText };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  // Handle filter field changes in drawer (temporary)
  const handleTempFilterChange = useCallback(
    (newFilters: Partial<FilterSearchParams>) => {
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

  // Initialize temp filters when opening drawer
  const handleOpenDrawer = () => {
    setTempFilters(filters);
    setShowFilterDrawer(true);
  };

  // Configure filter fields for the drawer
  const filterFields: FilterField[] = [
    {
      type: "select",
      key: "status",
      label: "Trạng thái",
      placeholder: "Chọn trạng thái",
      value: tempFilters.status || null,
      options: [
        { value: "PENDING", label: "Chờ duyệt" },
        { value: "APPROVED", label: "Đã duyệt" },
        { value: "REJECTED", label: "Bị từ chối" },
        { value: "EDIT_REQUESTED", label: "Yêu cầu chỉnh sửa" },
      ],
      onChange: (value) => handleTempFilterChange({ status: value as string }),
    },
    {
      type: "select",
      key: "doc_type",
      label: "Loại tài liệu",
      placeholder: "Chọn loại tài liệu",
      value: tempFilters.doc_type || null,
      options: [
        { value: "RESEARCH_REPORT", label: "Báo cáo nghiên cứu" },
        { value: "TEXTBOOK", label: "Giáo trình" },
        { value: "LECTURE", label: "Bài giảng" },
        { value: "THESIS", label: "Luận văn" },
        { value: "VIDEO", label: "Video" },
        { value: "OTHER", label: "Khác" },
      ],
      onChange: (value) =>
        handleTempFilterChange({ doc_type: value as string }),
    },
    {
      type: "select",
      key: "public_mode",
      label: "Chế độ công khai",
      placeholder: "Chọn chế độ",
      value: tempFilters.public_mode || null,
      options: [
        { value: "PUBLIC", label: "Công khai" },
        { value: "PRIVATE", label: "Riêng tư" },
        { value: "PRIVATE_SHARED", label: "Chia sẻ riêng tư" },
        { value: "SHARE_ORGANIZATION", label: "Chia sẻ tổ chức" },
      ],
      onChange: (value) =>
        handleTempFilterChange({ public_mode: value as string }),
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
      type: "dateRange",
      key: "dateRange",
      label: "Khoảng thời gian tạo",
      value: tempFilters.dateRange,
      onChange: (value) => {
        const dateStrings = value as [string, string];
        if (dateStrings && dateStrings[0] && dateStrings[1]) {
          handleTempFilterChange({ dateRange: dateStrings });
        } else {
          handleTempFilterChange({ dateRange: undefined });
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
        {/* Search Bar */}
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
            icon={<Search size={16} />}
            onClick={handleSearch}
            loading={loading}
          >
            Tìm kiếm
          </Button>
          <Button
            icon={<Filter size={16} />}
            onClick={handleOpenDrawer}
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
