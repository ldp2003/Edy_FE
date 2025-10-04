import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { message } from "antd";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";
import SearchHeader from "../../../components/user/search/SearchHeader";
import SearchFilters from "../../../components/user/search/SearchFilters";
import SearchResults from "../../../components/user/search/SearchResults";
// import SubjectSection from "../../../components/user/search/SubjectSection";

export interface SearchFilters {
  search?: string;
  doc_type?: string;
  level?: string;
  organization?: string;
  intensive?: boolean;
  published_year?: number;
  start_date?: string;
  end_date?: string;
  min_views?: number;
  max_views?: number;
  min_downloads?: number;
  max_downloads?: number;
  min_pages?: number;
  max_pages?: number;
  ordering?: string;
  order?: 1 | -1;
}

export type ViewMode = "grid" | "list";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Extract filters from URL
  const getFiltersFromURL = useCallback((): SearchFilters => {
    const filters: SearchFilters = {};

    const search = searchParams.get("q");
    const doc_type = searchParams.get("doc_type");
    const level = searchParams.get("level");
    const organization = searchParams.get("organization");
    const intensive = searchParams.get("intensive");
    const published_year = searchParams.get("published_year");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");
    const min_views = searchParams.get("min_views");
    const max_views = searchParams.get("max_views");
    const min_downloads = searchParams.get("min_downloads");
    const max_downloads = searchParams.get("max_downloads");
    const min_pages = searchParams.get("min_pages");
    const max_pages = searchParams.get("max_pages");
    const ordering = searchParams.get("ordering");
    const order = searchParams.get("order");
    const page = searchParams.get("page");

    if (search) filters.search = search;
    if (doc_type) filters.doc_type = doc_type;
    if (level) filters.level = level;
    if (organization) filters.organization = organization;
    if (intensive) filters.intensive = intensive === "true";
    if (published_year) filters.published_year = parseInt(published_year);
    if (start_date) filters.start_date = start_date;
    if (end_date) filters.end_date = end_date;
    if (min_views) filters.min_views = parseInt(min_views);
    if (max_views) filters.max_views = parseInt(max_views);
    if (min_downloads) filters.min_downloads = parseInt(min_downloads);
    if (max_downloads) filters.max_downloads = parseInt(max_downloads);
    if (min_pages) filters.min_pages = parseInt(min_pages);
    if (max_pages) filters.max_pages = parseInt(max_pages);
    if (ordering) filters.ordering = ordering;
    if (order) filters.order = parseInt(order) as 1 | -1;
    if (page) setCurrentPage(parseInt(page));

    return filters;
  }, [searchParams, setCurrentPage]);

  const [filters, setFilters] = useState<SearchFilters>(getFiltersFromURL);

  // Fetch documents based on filters
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: currentPage,
        limit: pageSize,
        status: "APPROVED", // Chỉ lấy tài liệu đã duyệt
      };

      const response = await DocumentService.getAllDocuments(params);
      setDocuments(response.documents || []);
      setTotalDocuments(response.total || 0);
    } catch (error) {
      console.error("Error fetching documents:", error);
      message.error("Có lỗi xảy ra khi tìm kiếm tài liệu");
      setDocuments([]);
      setTotalDocuments(0);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageSize]);

  // Update URL when filters change
  const updateURL = (newFilters: SearchFilters, newPage?: number) => {
    const newSearchParams = new URLSearchParams();

    if (newFilters.search) newSearchParams.set("q", newFilters.search);
    if (newFilters.doc_type)
      newSearchParams.set("doc_type", newFilters.doc_type);
    if (newFilters.level) newSearchParams.set("level", newFilters.level);
    if (newFilters.organization)
      newSearchParams.set("organization", newFilters.organization);
    if (newFilters.intensive !== undefined)
      newSearchParams.set("intensive", newFilters.intensive.toString());
    if (newFilters.published_year)
      newSearchParams.set(
        "published_year",
        newFilters.published_year.toString()
      );
    if (newFilters.start_date)
      newSearchParams.set("start_date", newFilters.start_date);
    if (newFilters.end_date)
      newSearchParams.set("end_date", newFilters.end_date);
    if (newFilters.min_views)
      newSearchParams.set("min_views", newFilters.min_views.toString());
    if (newFilters.max_views)
      newSearchParams.set("max_views", newFilters.max_views.toString());
    if (newFilters.min_downloads)
      newSearchParams.set("min_downloads", newFilters.min_downloads.toString());
    if (newFilters.max_downloads)
      newSearchParams.set("max_downloads", newFilters.max_downloads.toString());
    if (newFilters.min_pages)
      newSearchParams.set("min_pages", newFilters.min_pages.toString());
    if (newFilters.max_pages)
      newSearchParams.set("max_pages", newFilters.max_pages.toString());
    if (newFilters.ordering)
      newSearchParams.set("ordering", newFilters.ordering);
    if (newFilters.order)
      newSearchParams.set("order", newFilters.order.toString());

    const pageToSet = newPage || currentPage;
    if (pageToSet > 1) newSearchParams.set("page", pageToSet.toString());

    setSearchParams(newSearchParams);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    updateURL(newFilters, 1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(filters, page);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Handle sorting change
  const handleSortChange = (ordering: string, order: 1 | -1) => {
    const newFilters = { ...filters, ordering, order };
    handleFilterChange(newFilters);
  };

  // Fetch documents when filters or page change
  useEffect(() => {
    fetchDocuments();
  }, [filters, currentPage, fetchDocuments]);

  // Update filters when URL changes
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    setFilters(urlFilters);
  }, [searchParams, getFiltersFromURL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Header */}
        <SearchHeader
          initialQuery={filters.search || ""}
          onSearch={(query) =>
            handleFilterChange({ ...filters, search: query })
          }
        />

        {/* Search Filters */}
        <SearchFilters filters={filters} onFilterChange={handleFilterChange} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <SearchResults
              documents={documents}
              loading={loading}
              total={totalDocuments}
              currentPage={currentPage}
              pageSize={pageSize}
              viewMode={viewMode}
              onPageChange={handlePageChange}
              onViewModeChange={handleViewModeChange}
              onSortChange={handleSortChange}
              searchQuery={filters.search || ""}
            />
          </div>

          {/* Sidebar */}
          {/* <div className="lg:col-span-1">
            <SubjectSection />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
