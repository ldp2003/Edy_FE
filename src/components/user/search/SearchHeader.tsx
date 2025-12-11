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
  const [appliedFilters, setAppliedFilters] = useState<ISearchFilters | null>(
    null
  );
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");

  // Memoize scroll handler để tránh tạo lại function mỗi lần render
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    if (!target) return;
    const scrollTop = target.scrollTop;

    // Cố định vị trí khi cuộn xuống quá 200px trong main content
    const shouldBeFixed = scrollTop > 100;

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
    // console.log("SearchHeader initialQuery changed:", initialQuery);
    setQuery(initialQuery);
    setLastSearchQuery(initialQuery);
  }, [initialQuery]);

  // Listen for search events from Header component
  useEffect(() => {
    const handleHeaderSearchEvent = (event: CustomEvent) => {
      // console.log("Header search event received:", event.detail);
      const { query: headerQuery } = event.detail;
      const trimmedHeaderQuery = headerQuery?.trim();
      // console.log("Trimmed header query:", trimmedHeaderQuery);
      // console.log("Current lastSearchQuery:", lastSearchQuery);

      if (trimmedHeaderQuery && trimmedHeaderQuery !== lastSearchQuery) {
        // console.log("Processing header search for:", trimmedHeaderQuery);
        setQuery(trimmedHeaderQuery);
        setLastSearchQuery(trimmedHeaderQuery);
        onSearch(trimmedHeaderQuery);
      } else {
        // console.log("Skipping header search - duplicate or empty");
      }
    };

    window.addEventListener(
      "headerSearch",
      handleHeaderSearchEvent as EventListener
    );

    return () => {
      window.removeEventListener(
        "headerSearch",
        handleHeaderSearchEvent as EventListener
      );
    };
  }, [onSearch, lastSearchQuery]);

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    // console.log("SearchHeader handleSearch called with:", trimmedQuery);
    // console.log("Last search query was:", lastSearchQuery);

    // Avoid duplicate API calls
    if (trimmedQuery && trimmedQuery !== lastSearchQuery) {
      // console.log("Calling onSearch with:", trimmedQuery);
      setLastSearchQuery(trimmedQuery);
      onSearch(trimmedQuery);
    } else {
      // console.log("Skipping search - duplicate query or empty");
    }
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

  const handleApplyFilters = (newFilters: ISearchFilters) => {
    setAppliedFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  return (
    <>
      {/* Normal Header - ẩn hoàn toàn khi isFixed = true */}
      <div
        data-search-header
        className={`bg-[var(--secondary-background-color)] rounded-2xl p-4 mb-6 shadow-sm transition-all duration-300 ${
          isFixed
            ? "opacity-0 pointer-events-none h-0 mb-0 overflow-hidden"
            : "opacity-100"
        }`}
      >
        <div className="w-full mx-auto">
          {/* Header Title */}
          <div className="text-center md:text-left mb-4">
            <h1 className="text-base font-bold text-[var(--primary-text-color)] mb-1 text-center md:text-left">
              Khám phá tài liệu học tập
            </h1>
            <p className="text-[var(--secondary-text-color)] text-sm">
              Tìm kiếm trong hàng nghìn tài liệu chất lượng cao từ các trường
              đại học hàng đầu
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Search Input - Enhanced styling */}
            <div className="flex-1">
              <div className="relative">
                <Input
                  size="small"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập từ khóa tìm kiếm: Tên tài liệu, trường, môn học, tác giả..."
                  prefix={
                    <Search className="text-[var(--third-text-color)] w-5 h-5" />
                  }
                  suffix={
                    <Button
                      type="primary"
                      onClick={handleSearch}
                      className="border-0 shadow-none bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] transition-colors"
                      size="small"
                    >
                      Tìm kiếm
                    </Button>
                  }
                  className="pr-0 h-9 text-base border-2 border-[var(--border-color)] hover:border-[var(--primary-color)] focus:border-[var(--primary-color)] rounded-xl shadow-sm"
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
                  ? "bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] border-[var(--primary-color)] shadow-lg"
                  : "bg-[var(--primary-background-color)] hover:bg-[var(--secondary-background-color)] border-2 border-[var(--border-color)] hover:border-[var(--primary-color)] shadow-sm"
              }`}
              size="middle"
            >
              Bộ lọc
            </Button>
          </div>

          {/* Quick Search Tags */}
          <div className="mt-4">
            <p className="text-xs text-[var(--third-text-color)] mb-2">
              Tìm kiếm phổ biến:
            </p>
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
                    setQuery(tag); // Set the query in the search bar
                  }}
                  className="cursor-pointer px-3 py-1.5 bg-[var(--primary-background-color)] bg-opacity-70 hover:bg-[var(--primary-background-color)] hover:shadow-sm border border-[var(--border-color)] rounded-full text-xs text-[var(--secondary-text-color)] hover:text-[var(--primary-color)] transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          {appliedFilters &&
            Object.keys(appliedFilters).some(
              (key) =>
                key !== "search" &&
                key !== "ordering" &&
                key !== "order" &&
                appliedFilters[key as keyof typeof appliedFilters]
            ) && (
              <div className="bg-[var(--secondary-background-color)] border border-[var(--border-color)] rounded-xl p-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-[var(--primary-color)]" />
                  <h3 className="text-sm font-semibold text-[var(--primary-text-color)]">
                    Bộ lọc đang áp dụng
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(appliedFilters).map(([key, value]) => {
                    if (
                      !value ||
                      key === "search" ||
                      key === "ordering" ||
                      key === "order"
                    )
                      return null;

                    const getFilterLabel = (key: string) => {
                      const labels: { [key: string]: string } = {
                        doc_type: "Loại tài liệu",
                        level: "Trình độ",
                        organization: "Tổ chức",
                        author: "Tác giả",
                        publisher: "Nhà xuất bản",
                        published_year: "Năm xuất bản",
                        subject: "Môn học",
                        keyword: "Từ khóa",
                        intensive: "Chuyên sâu",
                        view_count: "Lượt xem",
                        download_count: "Lượt tải",
                        page: "Số trang",
                      };
                      return labels[key] || key;
                    };

                    const getFilterValue = (
                      key: string,
                      value: string | number | boolean | string[]
                    ) => {
                      if (key === "intensive") return value ? "Có" : "Không";
                      if (key === "doc_type" && typeof value === "string") {
                        const types: { [key: string]: string } = {
                          RESEARCH_REPORT: "Nghiên cứu",
                          VIDEO: "Video",
                          STUDY_GUIDE: "Đề cương",
                          TEXTBOOK: "Giáo trình",
                          ESSAY: "Tiểu luận",
                          SOLUTION_SET: "Bài giải",
                          THESIS: "Luận văn",
                          LECTURE: "Bài giảng",
                          OTHER: "Khác",
                        };
                        return types[value] || value;
                      }
                      if (key === "level" && typeof value === "string") {
                        const levels: { [key: string]: string } = {
                          STUDENT: "Học sinh",
                          UNIVERSITY: "Đại học",
                          LECTURER: "Giảng viên",
                          RESEARCHER: "Nghiên cứu sinh",
                          OTHER: "Khác",
                        };
                        return levels[value] || value;
                      }
                      return Array.isArray(value)
                        ? value.join(", ")
                        : value.toString();
                    };

                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--primary-background-color)] border border-[var(--border-color)] rounded-full text-xs font-medium text-[var(--primary-text-color)] shadow-sm"
                      >
                        <span className="font-semibold">
                          {getFilterLabel(key)}:
                        </span>
                        <span>{getFilterValue(key, value)}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Sticky Header - hiển thị khi isFixed = true */}
      {isFixed && (
        <div className="sticky top-0 mx-[-31px] bg-[var(--primary-background-color)]/95 backdrop-blur-sm border-b border-[var(--border-color)] shadow-lg z-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Sticky Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Input
                    size="middle"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tìm kiếm tài liệu..."
                    prefix={
                      <Search className="text-[var(--third-text-color)] w-4 h-4" />
                    }
                    suffix={
                      <Button
                        type="primary"
                        onClick={handleSearch}
                        className="border-0 shadow-none bg-[var(--primary-color)] hover:bg-[var(--secondary-color)]"
                        size="small"
                      >
                        Tìm
                      </Button>
                    }
                    className="pr-0 h-10 border-[var(--border-color)] hover:border-[var(--primary-color)] focus:border-[var(--primary-color)] rounded-lg"
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
                    ? "bg-[var(--primary-color)] hover:bg-[var(--secondary-color)] border-[var(--primary-color)]"
                    : "bg-[var(--primary-background-color)] hover:bg-[var(--secondary-background-color)] border-[var(--border-color)] hover:border-[var(--primary-color)]"
                }`}
              >
                Lọc
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Display applied filters */}

      {/* Filter Drawer - Enhanced styling */}
      <Drawer
        title={
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-[var(--primary-text-color)]" />
            <span className="text-lg font-semibold text-[var(--primary-text-color)]">
              Bộ lọc tìm kiếm
            </span>
          </div>
        }
        placement="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        width={420}
        className="filter-drawer"
      >
        {filters && (
          <SearchFilters
            filters={filters}
            onFilterChange={handleApplyFilters}
            onApply={() => setFilterDrawerOpen(false)}
            onReset={() => setFilterDrawerOpen(false)}
          />
        )}
      </Drawer>
    </>
  );
};

export default SearchHeader;
