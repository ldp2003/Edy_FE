import React from "react";
import { Card, Pagination, Empty, Spin } from "antd";
import DocumentCard from "../document/documentCard/DocumentCard";
import RecentItem from "../document/documentCard/RecentItem";
import type { Document } from "../../../models/document";
import type { ViewMode } from "../../../pages/user/search/SearchPage";

interface SearchResultsProps {
  documents: Document[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  viewMode: ViewMode;
  searchQuery: string;
  onPageChange: (page: number) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (ordering: string, order: 1 | -1) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  documents,
  loading,
  total,
  currentPage,
  pageSize,
  viewMode,
  searchQuery,
  onPageChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Results Header - Simple */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Kết quả tìm kiếm
          {searchQuery && (
            <span className="text-blue-600 ml-2">"{searchQuery}"</span>
          )}
        </h2>
        <p className="text-sm text-gray-600">
          Tìm thấy <span className="font-medium">{total.toLocaleString()}</span>{" "}
          tài liệu
        </p>
      </div>

      {/* Results Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <Empty
            description={
              <div className="text-center">
                <p className="text-gray-500 mb-2">
                  Không tìm thấy tài liệu nào phù hợp
                </p>
                <p className="text-sm text-gray-400">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </div>
            }
            className="py-12"
          />
        </Card>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {documents.map((document) => (
                <DocumentCard
                  key={document._id}
                  title={document.title}
                  description={
                    document.description?.summary_by_user ||
                    document.description?.summary_by_ai ||
                    ""
                  }
                  imageUrl={document.cover_page}
                  document={document}
                  navigationPath={`/documents/${document._id}`}
                />
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <Card>
              <div className="space-y-3">
                {documents.map((document) => (
                  <div
                    key={document._id}
                    className="cursor-pointer hover:bg-gray-50 p-2 rounded"
                    onClick={() =>
                      (window.location.href = `/documents/${document._id}`)
                    }
                  >
                    <RecentItem
                      title={document.title}
                      views={document.view}
                      rating={0} // TODO: Calculate actual rating
                      pages={document.page || 0}
                      date={new Date(document.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                      intensive={document.intensive}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Pagination */}
          {total > pageSize && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={onPageChange}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${
                    range[1]
                  } của ${total.toLocaleString()} tài liệu`
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
