import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { message } from "antd";
import { DocumentService } from "../../../utils/DocumentService";
import type { Document } from "../../../models/document";
import SearchHeader from "../../../components/user/search/SearchHeader";
import SearchResults from "../../../components/user/search/SearchResults";
import SubjectService from "../../../utils/SubjectService";
import type { Subject } from "../../../models/subject";
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
  public_mode?: string;
  page?: number;
  title?: string;
  view_count?: number;
  download_count?: number;
  ordering?: string;
  order?: 1 | -1;
}

export type ViewMode = "grid" | "list";
export type TabMode = "all" | "subjects";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState<Document[]>([]);

  const [isShowingFallback, setIsShowingFallback] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentTab, setCurrentTab] = useState<TabMode>("all");
  const isUpdatingFromCode = useRef(false);
  const [lastSubjectsQuery, setLastSubjectsQuery] = useState<string>("");

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
    const public_mode = searchParams.get("public_mode");
    const pageFilter = searchParams.get("pageFilter"); // Số trang của document
    const title = searchParams.get("title");
    const view_count = searchParams.get("view_count");
    const download_count = searchParams.get("download_count");
    const ordering = searchParams.get("ordering");
    const order = searchParams.get("order");
    const page = searchParams.get("page"); // Trang hiện tại của pagination

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
    if (public_mode) filters.public_mode = public_mode;
    if (pageFilter) filters.page = parseInt(pageFilter);
    if (title) filters.title = title;
    if (view_count) filters.view_count = parseInt(view_count);
    if (download_count) filters.download_count = parseInt(download_count);
    if (ordering) filters.ordering = ordering;
    if (order) filters.order = parseInt(order) as 1 | -1;
    if (page) setCurrentPage(parseInt(page));

    return filters;
  }, [searchParams, setCurrentPage]);

  const [filters, setFilters] = useState<SearchFilters>(getFiltersFromURL);

  // Fetch documents based on filters
  const fetchDocuments = useCallback(async () => {
    console.log("=== FETCH DOCUMENTS CALLED ===");
    console.log("Current tab:", currentTab);
    console.log("Current filters:", filters);
    console.log("Current page:", currentPage);

    // Skip fetching documents for subjects tab, only show subjects
    if (currentTab === "subjects") {
      // If subjects are already fetched for the current query, skip fetching
      if (lastSubjectsQuery === filters.search && subjects.length > 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const subRes = await SubjectService.searchSubjects(
          filters.search || ""
        );
        console.log("Fetched subjects:", subRes);
        setSubjects(subRes || []);
        setLastSubjectsQuery(filters.search || "");
        setTotalDocuments(6); // Mock count for subjects
      } catch (error) {
        console.error("Error fetching subjects:", error);
        message.error("Có lỗi xảy ra khi tìm kiếm môn học");
        setSubjects([]);
        setTotalDocuments(0);
      } finally {
        setLoading(false);
      }
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

      console.log("API call with params:", params);
      const response = await DocumentService.fetchNewestDocuments(params);
      const subRes = await SubjectService.searchSubjects(filters.search || "");
      console.log("Fetched subjects:", subRes);
      setDocuments(response.documents || []);
      setSubjects(subRes || []);
      setLastSubjectsQuery(filters.search || "");
      setTotalDocuments(response.total || 0);
      setIsShowingFallback(false);

      // If no documents found and we're on all tab, fetch recommended documents
      if ((response.documents || []).length === 0 && currentTab === "all") {
        let fallbackDocuments: Document[] = [];
        try {
          const recommendedParams = {
            ...filters,
            limit: 6, // Limit recommended documents to 6
            status: "APPROVED",
          };
          const recommendedResponse =
            await DocumentService.fetchRecommendedDocuments(recommendedParams);
          fallbackDocuments = recommendedResponse.documents || [];

          // If no recommended documents, fetch newest documents
          if (fallbackDocuments.length === 0) {
            const newestParams = {
              limit: 6,
              status: "APPROVED",
            };
            const newestResponse = await DocumentService.fetchNewestDocuments(
              newestParams
            );
            fallbackDocuments = newestResponse.documents || [];
          }
        } catch (error) {
          console.error("Error fetching recommended documents:", error);
          // Fallback to newest documents if recommended fails
          try {
            const newestParams = {
              limit: 6,
              status: "APPROVED",
            };
            const newestResponse = await DocumentService.fetchNewestDocuments(
              newestParams
            );
            fallbackDocuments = newestResponse.documents || [];
          } catch (newestError) {
            console.error("Error fetching newest documents:", newestError);
            fallbackDocuments = [];
          }
        }

        // setRecommendedDocuments(fallbackDocuments);
        if (fallbackDocuments.length > 0) {
          setDocuments(fallbackDocuments);
          setTotalDocuments(fallbackDocuments.length);
          setIsShowingFallback(true);
        }
      } else {
        // setRecommendedDocuments([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      message.error("Có lỗi xảy ra khi tìm kiếm tài liệu");
      setDocuments([]);
      setSubjects([]);
      setTotalDocuments(0);

      // Even on error, try to show recommended/newest documents
      if (currentTab === "all") {
        let fallbackDocuments: Document[] = [];
        try {
          const recommendedParams = {
            ...filters,
            limit: 6,
            status: "APPROVED",
          };
          const recommendedResponse =
            await DocumentService.fetchRecommendedDocuments(recommendedParams);
          fallbackDocuments = recommendedResponse.documents || [];

          // If no recommended documents, fetch newest documents
          if (fallbackDocuments.length === 0) {
            const newestParams = {
              limit: 6,
              status: "APPROVED",
            };
            const newestResponse = await DocumentService.fetchNewestDocuments(
              newestParams
            );
            fallbackDocuments = newestResponse.documents || [];
          }
        } catch (fallbackError) {
          console.error("Error fetching fallback documents:", fallbackError);
          // Fallback to newest documents if recommended fails
          try {
            const newestParams = {
              limit: 6,
              status: "APPROVED",
            };
            const newestResponse = await DocumentService.fetchNewestDocuments(
              newestParams
            );
            fallbackDocuments = newestResponse.documents || [];
          } catch (newestError) {
            console.error("Error fetching newest documents:", newestError);
            fallbackDocuments = [];
          }
        }

        // setRecommendedDocuments(fallbackDocuments);
        if (fallbackDocuments.length > 0) {
          setDocuments(fallbackDocuments);
          setTotalDocuments(fallbackDocuments.length);
          setIsShowingFallback(true);
        }
      } else {
        // setRecommendedDocuments([]);
      }
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    currentPage,
    pageSize,
    currentTab,
    lastSubjectsQuery,
    subjects.length,
  ]);

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
    if (newFilters.public_mode)
      newSearchParams.set("public_mode", newFilters.public_mode);
    if (newFilters.page)
      newSearchParams.set("pageFilter", newFilters.page.toString());
    if (newFilters.title) newSearchParams.set("title", newFilters.title);
    if (newFilters.view_count)
      newSearchParams.set("view_count", newFilters.view_count.toString());
    if (newFilters.download_count)
      newSearchParams.set(
        "download_count",
        newFilters.download_count.toString()
      );
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
    console.log("SearchPage handleFilterChange called with:", newFilters);
    console.log("Previous filters were:", filters);

    // Prevent unnecessary updates if filters are the same
    const filtersChanged =
      JSON.stringify(filters) !== JSON.stringify(newFilters);
    if (!filtersChanged) {
      console.log("Filters unchanged, skipping update");
      return;
    }

    isUpdatingFromCode.current = true;
    setFilters(newFilters);
    setCurrentPage(1);
    // setRecommendedDocuments([]); // Reset recommended documents when filters change
    setIsShowingFallback(false); // Reset fallback flag
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
    // Reset data when switching tabs to avoid showing old data
    setDocuments([]);
    // setRecommendedDocuments([]);
    setIsShowingFallback(false);
    setSubjects([]);

    // Remove tab from URL to avoid URL changes
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("tab");
    newSearchParams.delete("page"); // Reset page to 1
    setSearchParams(newSearchParams);
  };

  // Fetch documents when filters, page, or tab change
  useEffect(() => {
    if (filters && currentTab) {
      fetchDocuments();
    }
  }, [filters, currentTab, fetchDocuments]);

  // Update filters when URL changes (only on initial load or external URL changes)
  useEffect(() => {
    // Skip if we're updating from code (to avoid circular updates)
    if (isUpdatingFromCode.current) {
      isUpdatingFromCode.current = false;
      return;
    }

    const urlFilters = getFiltersFromURL();

    // Only update if filters actually differ (avoid unnecessary re-renders)
    const filtersChanged =
      JSON.stringify(filters) !== JSON.stringify(urlFilters);
    if (filtersChanged) {
      console.log("URL filters changed, updating filters:", urlFilters);
      setFilters(urlFilters);
    }
  }, [searchParams, getFiltersFromURL, filters]);

  // Remove tab from URL on mount if present
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (newSearchParams.has("tab")) {
      newSearchParams.delete("tab");
      setSearchParams(newSearchParams);
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-white rounded-lg shadow">
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
            <div className="flex border-b border-gray-200 text-sm">
              <button
                className={`cursor-pointer px-4 sm:px-6 py-3 font-medium border-b-2 transition-colors ${
                  currentTab === "all"
                    ? "text-[var(--primary-color)] border-[var(--primary-color)]"
                    : "text-[var(--third-text-color)] hover:text-black border-transparent"
                }`}
                onClick={() => handleTabChange("all")}
              >
                Tất cả
              </button>
              <button
                className={`cursor-pointer px-4 sm:px-6 py-3 font-medium border-b-2 transition-colors ${
                  currentTab === "subjects"
                    ? "text-[var(--primary-color)] border-[var(--primary-color)]"
                    : "text-[var(--third-text-color)] hover:text-black border-transparent"
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
                subjects={subjects}
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
                isShowingFallback={isShowingFallback}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
