import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "antd";
import PostTable from "./PostTable";
import PostListView from "./PostListView";
import PostGridView from "./PostGridView";
import PostFilterSearch from "./PostFilterSearch";
import type { FilterSearchParams } from "./PostFilterSearch";
import UploadButton from "../../common/buttons/UploadButton";
import type { Document } from "../../../models/document";
import { DocumentService } from "../../../utils/DocumentService";

const PersonalPostList: React.FC = () => {
  // Default to list view on mobile, table view on desktop
  const [viewMode, setViewMode] = useState(() => {
    // Check if we're on mobile (screen width < 768px)
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return "list";
    }
    return "table";
  });
  const [isDesktop, setIsDesktop] = useState(() => {
    return typeof window !== "undefined" && window.innerWidth >= 768;
  });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterSearchParams>({});
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch documents with filters
  const fetchDocuments = useCallback(async () => {
    setLoading(true);

    try {
      const apiParams = {
        page: currentPage,
        limit: pageSize,
        ...filters,
      };
      const data = await DocumentService.getMyDocuments(apiParams);

      // Sử dụng trực tiếp Document[] từ API
      const docs = Array.isArray(data?.documents) ? data.documents : [];

      setDocuments(docs);
      setTotal(data?.total || 0);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters]);

  // Auto-switch to list view on mobile and track desktop state
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth < 768;
        const isDesktopNow = window.innerWidth >= 768;

        setIsDesktop(isDesktopNow);

        if (isMobile && viewMode !== "list") {
          setViewMode("list");
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [viewMode]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters: FilterSearchParams = {};

    const search = searchParams.get("search");
    if (search) urlFilters.search = search;

    const status = searchParams.get("status");
    if (status) urlFilters.status = status;

    const doc_type = searchParams.get("doc_type");
    if (doc_type) urlFilters.doc_type = doc_type;

    const public_mode = searchParams.get("public_mode");
    if (public_mode) urlFilters.public_mode = public_mode;

    const ordering = searchParams.get("ordering");
    if (ordering) urlFilters.ordering = ordering;

    const order = searchParams.get("order");
    if (order) urlFilters.order = parseInt(order) as 1 | -1;

    const published_year = searchParams.get("published_year");
    if (published_year) urlFilters.published_year = parseInt(published_year);

    const createdAt = searchParams.get("createdAt");
    if (createdAt) urlFilters.createdAt = createdAt;

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters: FilterSearchParams) => {
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change

      // Update URL params
      const newSearchParams = new URLSearchParams();

      if (newFilters.search) {
        newSearchParams.set("search", newFilters.search);
      }
      if (newFilters.status) {
        newSearchParams.set("status", newFilters.status);
      }
      if (newFilters.doc_type) {
        newSearchParams.set("doc_type", newFilters.doc_type);
      }
      if (newFilters.public_mode) {
        newSearchParams.set("public_mode", newFilters.public_mode);
      }
      if (newFilters.ordering) {
        newSearchParams.set("ordering", newFilters.ordering);
      }
      if (newFilters.order) {
        newSearchParams.set("order", newFilters.order.toString());
      }
      if (newFilters.published_year) {
        newSearchParams.set(
          "published_year",
          newFilters.published_year.toString()
        );
      }
      if (newFilters.createdAt) {
        newSearchParams.set("createdAt", newFilters.createdAt);
      }

      setSearchParams(newSearchParams);
    },
    [setSearchParams]
  );

  const renderContent = () => {
    switch (viewMode) {
      case "table":
        return <PostTable data={documents} loading={loading} />;
      case "list":
        return <PostListView data={documents} loading={loading} />;
      case "grid":
        return <PostGridView data={documents} loading={loading} />;
      default:
        return <PostListView data={documents} loading={loading} />;
    }
  };

  // Cấu hình locale tiếng Việt cho Pagination
  const paginationLocale = {
    items_per_page: "/ trang",
    jump_to: "Đến trang",
    jump_to_confirm: "xác nhận",
    page: "Trang",
    prev_page: "Trang trước",
    next_page: "Trang tiếp",
    prev_5: "5 trang trước",
    next_5: "5 trang tiếp",
    prev_3: "3 trang trước",
    next_3: "3 trang tiếp",
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Filter and Search */}
      <PostFilterSearch onFilterChange={handleFilterChange} loading={loading} />

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 w-full sm:w-auto">
            <h1 className="text-sm md:text-base font-bold text-[var(--primary-text-color)] text-center md:text-left">
              Tài liệu của tôi
            </h1>
            {/* Only show view selector on desktop */}
            {isDesktop ? (
              <select
                className="px-3 md:px-4 text-xs w-full sm:w-fit border rounded h-8 md:h-5"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="table">Hiển thị dạng bảng</option>
                <option value="list">Hiển thị dạng danh sách</option>
                <option value="grid">Hiển thị dạng lưới</option>
              </select>
            ) : null}
          </div>

          <UploadButton onClick={() => navigate("/upload-document")} />
        </div>
        {renderContent()}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex justify-center mt-4 md:mt-6 ">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              className="text-[10px]"
              showSizeChanger={true}
              showQuickJumper={true}
              locale={paginationLocale}
              showTotal={(total, range) => (
                <div className="text-[10px] md:text-sm text-[var(--secondary-text-color)]">
                  Hiển thị {range[0]}-{range[1]} của {total} tài liệu
                </div>
              )}
              onChange={(page, size) => {
                setCurrentPage(page);
                if (size !== pageSize) {
                  setPageSize(size);
                  setCurrentPage(1); // Reset to first page when changing page size
                  console.log("Page size changed to:", size);
                }
              }}
              pageSizeOptions={["5", "10", "20", "50"]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalPostList;
