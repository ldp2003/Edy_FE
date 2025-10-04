import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { message } from "antd";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";
import SearchHeader from "../../../components/user/search/SearchHeader";
import SearchResults from "../../../components/user/search/SearchResults";
// import SubjectSection from "../../../components/user/search/SubjectSection";

export interface SearchFilters {
  search?: string;
  doc_type?: string;
  level?: string;
  organization?: string;
  intensive?: boolean;
  published_year?: number;
  publisher?: string;
  author?: string[];
  keyword?: string[];
  subject?: string;
  status?: string;
  summary_status?: string;
  public_mode?: string;
  ordering?: string;
  order?: 1 | -1;
}

export type ViewMode = "grid" | "list";
export type TabMode = "all" | "subjects";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentTab, setCurrentTab] = useState<TabMode>("all");

  // Extract filters from URL
  const getFiltersFromURL = useCallback((): SearchFilters => {
    const filters: SearchFilters = {};

    const search = searchParams.get("q");
    const doc_type = searchParams.get("doc_type");
    const level = searchParams.get("level");
    const organization = searchParams.get("organization");
    const intensive = searchParams.get("intensive");
    const published_year = searchParams.get("published_year");
    const publisher = searchParams.get("publisher");
    const author = searchParams.get("author");
    const keyword = searchParams.get("keyword");
    const subject = searchParams.get("subject");
    const status = searchParams.get("status");
    const summary_status = searchParams.get("summary_status");
    const public_mode = searchParams.get("public_mode");
    const ordering = searchParams.get("ordering");
    const order = searchParams.get("order");
    const page = searchParams.get("page");

    if (search) filters.search = search;
    if (doc_type) filters.doc_type = doc_type;
    if (level) filters.level = level;
    if (organization) filters.organization = organization;
    if (intensive) filters.intensive = intensive === "true";
    if (published_year) filters.published_year = parseInt(published_year);
    if (publisher) filters.publisher = publisher;
    if (author) filters.author = author.split(",");
    if (keyword) filters.keyword = keyword.split(",");
    if (subject) filters.subject = subject;
    if (status) filters.status = status;
    if (summary_status) filters.summary_status = summary_status;
    if (public_mode) filters.public_mode = public_mode;
    if (ordering) filters.ordering = ordering;
    if (order) filters.order = parseInt(order) as 1 | -1;
    if (page) setCurrentPage(parseInt(page));

    return filters;
  }, [searchParams, setCurrentPage]);

  const [filters, setFilters] = useState<SearchFilters>(getFiltersFromURL);

  // Fetch documents based on filters
  const fetchDocuments = useCallback(async () => {
    // Skip fetching documents for subjects tab, only show subjects
    if (currentTab === "subjects") {
      setDocuments([]);
      setTotalDocuments(6); // Mock count for subjects
      return;
    }

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
  }, [filters, currentPage, pageSize, currentTab]);

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
    if (newFilters.publisher)
      newSearchParams.set("publisher", newFilters.publisher);
    if (newFilters.author && newFilters.author.length > 0)
      newSearchParams.set("author", newFilters.author.join(","));
    if (newFilters.keyword && newFilters.keyword.length > 0)
      newSearchParams.set("keyword", newFilters.keyword.join(","));
    if (newFilters.subject) newSearchParams.set("subject", newFilters.subject);
    if (newFilters.status) newSearchParams.set("status", newFilters.status);
    if (newFilters.summary_status)
      newSearchParams.set("summary_status", newFilters.summary_status);
    if (newFilters.public_mode)
      newSearchParams.set("public_mode", newFilters.public_mode);
    if (newFilters.ordering)
      newSearchParams.set("ordering", newFilters.ordering);
    if (newFilters.order)
      newSearchParams.set("order", newFilters.order.toString());

    // Add current tab to URL
    if (currentTab !== "all") newSearchParams.set("tab", currentTab);

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

  // Handle tab change
  const handleTabChange = (tab: TabMode) => {
    setCurrentTab(tab);
    setCurrentPage(1);

    // Update URL with new tab
    const newSearchParams = new URLSearchParams(searchParams);
    if (tab !== "all") {
      newSearchParams.set("tab", tab);
    } else {
      newSearchParams.delete("tab");
    }
    newSearchParams.delete("page"); // Reset page to 1
    setSearchParams(newSearchParams);
  };

  // Fetch documents when filters, page, or tab change
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Update filters when URL changes
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    setFilters(urlFilters);
  }, [searchParams, getFiltersFromURL]);

  // Handle tab state from URL
  useEffect(() => {
    const tabFromURL = searchParams.get("tab") as TabMode;
    if (tabFromURL && tabFromURL !== currentTab) {
      setCurrentTab(tabFromURL);
    } else if (!tabFromURL && currentTab !== "all") {
      setCurrentTab("all");
    }
  }, [searchParams, currentTab]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6 bg-white rounded-lg shadow">
        {/* Search Header with integrated filter drawer */}
        <SearchHeader
          initialQuery={filters.search || ""}
          onSearch={(query) =>
            handleFilterChange({ ...filters, search: query })
          }
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  currentTab === "all"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 hover:text-gray-700 border-transparent"
                }`}
                onClick={() => handleTabChange("all")}
              >
                Tất cả
              </button>
              <button
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  currentTab === "subjects"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 hover:text-gray-700 border-transparent"
                }`}
                onClick={() => handleTabChange("subjects")}
              >
                Môn học
              </button>
            </div>
          </div>

          <div className="">
            {/* Main Content */}
            <div className="">
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
                currentTab={currentTab}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
