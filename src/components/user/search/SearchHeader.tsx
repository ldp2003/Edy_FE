import React, { useState, useEffect, useCallback } from "react";
import { Input, Button, Drawer } from "antd";
import { Search, Filter } from "lucide-react";
import SearchFilters from "./SearchFilters";
import type { SearchFilters as ISearchFilters } from "../../../pages/user/search/SearchPage";

interface SearchHeaderProps {
  initialQuery: string;
  onSearch: (query: string) => void;
  filters?: ISearchFilters;
  onFilterChange?: (filters: ISearchFilters) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  initialQuery,
  onSearch,
  filters,
  onFilterChange,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  // Memoize scroll handler để tránh tạo lại function mỗi lần render
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    if (!target) return;
    const scrollTop = target.scrollTop;

    // Cố định vị trí khi cuộn xuống quá 200px trong main content
    const shouldBeFixed = scrollTop > 80;

    // Chỉ update state khi có thay đổi để tránh re-render liên tục
    setIsFixed((prev) => {
      if (prev !== shouldBeFixed) {
        return shouldBeFixed;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    // Tìm container cha có overflow-y-auto chứa SearchHeader này
    const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
      if (!element || element === window.document.body) return null;
      const computedStyle = window.getComputedStyle(element);
      if (
        computedStyle.overflowY === "auto" ||
        computedStyle.overflowY === "scroll"
      ) {
        return element;
      }
      return findScrollableParent(element.parentElement!);
    };
    // Tìm element hiện tại và container scroll cha của nó
    const currentElement = window.document.querySelector(
      `[data-search-header]`
    ) as HTMLElement;
    let scrollContainer: HTMLElement | null = null;
    if (currentElement) {
      scrollContainer = findScrollableParent(currentElement.parentElement!);
    } else {
      // Fallback: tìm container với class overflow-y-auto trong cùng page
      scrollContainer = window.document.querySelector(
        ".flex-1.overflow-y-auto"
      ) as HTMLElement;
    }
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const hasActiveFilters = () => {
    if (!filters) return false;
    const filterKeys = Object.keys(filters).filter(
      (key) => key !== "search" && key !== "ordering" && key !== "order"
    );
    return filterKeys.length > 0;
  };

  return (
    <>
      {/* Normal Header - ẩn hoàn toàn khi isFixed = true */}
      <div
        data-search-header
        className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 shadow-sm transition-all duration-300 ${
          isFixed
            ? "opacity-0 pointer-events-none h-0 mb-0 overflow-hidden"
            : "opacity-100"
        }`}
      >
        <div className="w-full mx-auto">
          {/* Header Title */}
          <div className="text-left mb-4">
            <h1 className="text-base font-bold text-gray-900 mb-1">
              Khám phá tài liệu học tập
            </h1>
            <p className="text-gray-600 text-sm">
              Tìm kiếm trong hàng nghìn tài liệu chất lượng cao từ các trường
              đại học hàng đầu
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input - Enhanced styling */}
            <div className="flex-1">
              <div className="relative">
                <Input
                  size="small"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập từ khóa tìm kiếm: Tên tài liệu, trường, môn học, tác giả..."
                  prefix={<Search className="text-gray-400 w-5 h-5" />}
                  suffix={
                    <Button
                      type="primary"
                      onClick={handleSearch}
                      className="border-0 shadow-none bg-blue-600 hover:bg-blue-700 transition-colors"
                      size="small"
                    >
                      Tìm kiếm
                    </Button>
                  }
                  className="pr-0 h-9 text-base border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 rounded-xl shadow-sm"
                  style={{
                    borderRadius: "12px",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>

            {/* Filter Button - Enhanced styling */}
            <Button
              type={hasActiveFilters() ? "primary" : "default"}
              icon={<Filter className="w-5 h-5" />}
              onClick={() => setFilterDrawerOpen(true)}
              className={`flex items-center gap-2 h-14 px-6 rounded-xl font-medium transition-all duration-200 ${
                hasActiveFilters()
                  ? "bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-lg shadow-blue-200"
                  : "bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-400 shadow-sm"
              }`}
              size="middle"
            >
              Bộ lọc
              {hasActiveFilters() && (
                <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full ml-1 font-semibold">
                  {
                    Object.keys(filters || {}).filter(
                      (key) =>
                        key !== "search" &&
                        key !== "ordering" &&
                        key !== "order"
                    ).length
                  }
                </span>
              )}
            </Button>
          </div>

          {/* Quick Search Tags */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Tìm kiếm phổ biến:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Toán cao cấp",
                "Lập trình",
                "Kinh tế",
                "Tiếng Anh",
                "Vật lý",
                "Hóa học",
              ].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setQuery(tag);
                    onSearch(tag);
                  }}
                  className="px-3 py-1.5 bg-white bg-opacity-70 hover:bg-white hover:shadow-sm border border-gray-200 rounded-full text-xs text-gray-700 hover:text-blue-600 transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Header - hiển thị khi isFixed = true */}
      {isFixed && (
        <div className="sticky top-0 mx-[-16px] bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Sticky Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Input
                    size="middle"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tìm kiếm tài liệu..."
                    prefix={<Search className="text-gray-400 w-4 h-4" />}
                    suffix={
                      <Button
                        type="primary"
                        onClick={handleSearch}
                        className="border-0 shadow-none bg-blue-600 hover:bg-blue-700"
                        size="small"
                      >
                        Tìm
                      </Button>
                    }
                    className="pr-0 h-10 border-gray-200 hover:border-blue-400 focus:border-blue-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Sticky Filter Button */}
              <Button
                type={hasActiveFilters() ? "primary" : "default"}
                icon={<Filter className="w-4 h-4" />}
                onClick={() => setFilterDrawerOpen(true)}
                className={`flex items-center gap-2 h-10 px-4 rounded-lg font-medium transition-all duration-200 ${
                  hasActiveFilters()
                    ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                    : "bg-white hover:bg-gray-50 border-gray-200 hover:border-blue-400"
                }`}
              >
                Lọc
                {hasActiveFilters() && (
                  <span className="bg-white bg-opacity-20 text-xs px-1.5 py-0.5 rounded-full ml-1 font-semibold">
                    {
                      Object.keys(filters || {}).filter(
                        (key) =>
                          key !== "search" &&
                          key !== "ordering" &&
                          key !== "order"
                      ).length
                    }
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Drawer - Enhanced styling */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              Bộ lọc tìm kiếm
            </span>
          </div>
        }
        placement="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        width={420}
        className="filter-drawer"
        headerStyle={{
          borderBottom: "1px solid #e5e7eb",
          padding: "20px 24px",
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
        bodyStyle={{
          padding: "24px",
          background: "#fafafa",
        }}
      >
        {filters && onFilterChange && (
          <SearchFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onApply={() => setFilterDrawerOpen(false)}
            onReset={() => setFilterDrawerOpen(false)}
          />
        )}
      </Drawer>
    </>
  );
};

export default SearchHeader;
