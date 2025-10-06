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
  createdAt?: string;
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
      type: "date",
      key: "createdAt",
      label: "Ngày tạo",
      placeholder: "Chọn ngày tạo",
      value: tempFilters.createdAt || null,
      onChange: (value) =>
        handleTempFilterChange({ createdAt: value as string }),
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
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Filter size={14} />
                Bộ lọc đang áp dụng:
              </span>
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Tìm kiếm: "{filters.search}"
                </span>
              )}
              {filters.status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                  Trạng thái:{" "}
                  {filters.status === "PENDING"
                    ? "Chờ duyệt"
                    : filters.status === "APPROVED"
                    ? "Đã duyệt"
                    : filters.status === "REJECTED"
                    ? "Bị từ chối"
                    : "Yêu cầu chỉnh sửa"}
                </span>
              )}
              {filters.doc_type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  Loại:{" "}
                  {filters.doc_type === "RESEARCH_REPORT"
                    ? "Nghiên cứu"
                    : filters.doc_type === "TEXTBOOK"
                    ? "Giáo trình"
                    : filters.doc_type === "LECTURE"
                    ? "Bài giảng"
                    : filters.doc_type === "THESIS"
                    ? "Luận văn"
                    : filters.doc_type === "VIDEO"
                    ? "Video"
                    : filters.doc_type === "STUDY_GUIDE"
                    ? "Đề cương"
                    : filters.doc_type === "ESSAY"
                    ? "Tiểu luận"
                    : filters.doc_type === "SOLUTION_SET"
                    ? "Bài giải"
                    : "Khác"}
                </span>
              )}
              {filters.public_mode && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                  Chế độ:{" "}
                  {filters.public_mode === "PUBLIC"
                    ? "Công khai"
                    : filters.public_mode === "PRIVATE"
                    ? "Riêng tư"
                    : filters.public_mode === "PRIVATE_SHARED"
                    ? "Chia sẻ riêng tư"
                    : "Chia sẻ tổ chức"}
                </span>
              )}
              {filters.published_year && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Năm: {filters.published_year}
                </span>
              )}
              {filters.createdAt && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                  Ngày tạo: {filters.createdAt}
                </span>
              )}
              {filters.ordering && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                  Sắp xếp:{" "}
                  {filters.ordering === "createdAt"
                    ? filters.order === -1
                      ? "Mới nhất"
                      : "Cũ nhất"
                    : filters.ordering === "title"
                    ? filters.order === 1
                      ? "Tên A-Z"
                      : "Tên Z-A"
                    : filters.ordering === "view"
                    ? filters.order === -1
                      ? "Lượt xem cao"
                      : "Lượt xem thấp"
                    : "Tùy chỉnh"}
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
