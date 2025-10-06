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

interface Post {
  key: string;
  index: number;
  title: string;
  views: number;
  comments: number;
  download_count: number;
  rating: string;
  status: string;
  mode: string;
  public_mode: string;
  url: string;
  createdAt: string;
  content_rejection?: {
    message: string;
  };
}

const PersonalPostList: React.FC = () => {
  const [viewMode, setViewMode] = useState("table");
  const [documents, setDocuments] = useState<Post[]>([]);
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

      console.log("API Params:", apiParams); // Debug log

      const data = await DocumentService.getMyDocuments(apiParams);
      console.log("API Response:", data); // Debug log

      // Map dữ liệu BE sang Post[]
      const docs = Array.isArray(data?.documents)
        ? data.documents.map((doc: Document, idx: number) => ({
            key: doc._id,
            index: (currentPage - 1) * pageSize + idx + 1,
            title: doc.title,
            views: doc.view || 0,
            comments: doc.comment_count || 0,
            rating: "0%", // Nếu có trường rating thì lấy, không thì để mặc định
            status: doc.status || "PENDING",
            mode: doc.file_type || "PDF",
            public_mode: doc.public_mode || "PRIVATE",
            url: doc.url,
            createdAt: doc.createdAt,
            download_count: doc.download_count || 0,
            content_rejection: doc.content_rejection
              ? {
                  message: doc.content_rejection.message,
                }
              : undefined,
          }))
        : [];

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
        return <PostTable data={documents} loading={loading} />;
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
    <div className="space-y-6">
      {/* Filter and Search */}
      <PostFilterSearch onFilterChange={handleFilterChange} loading={loading} />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-row justify-between items-center gap-4 mb-4">
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-base font-bold text-[var(--primary-text-color)]">
              Tài liệu của tôi
            </h1>
            <select
              className="px-4 text-xs w-fit border rounded h-5"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="table">Hiển thị dạng bảng</option>
              <option value="list">Hiển thị dạng danh sách</option>
              <option value="grid">Hiển thị dạng lưới</option>
            </select>
          </div>

          <UploadButton onClick={() => navigate("/upload-document")} />
        </div>
        {renderContent()}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              showSizeChanger={true}
              showQuickJumper={true}
              locale={paginationLocale}
              showTotal={(total, range) =>
                `Hiển thị ${range[0]}-${range[1]} của ${total} tài liệu`
              }
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
