import React from "react";
import { Card, Pagination, Empty, Spin, Select, Button } from "antd";
import { Grid, List } from "lucide-react";
import DocumentCard from "../document/documentCard/DocumentCard";
import RecentItem from "../document/documentCard/RecentItem";
import SubjectGrid from "../subject/SubjectGrid";
import type { Document } from "../../../models/document";
import type { Subject } from "../../../models/subject";
import type { ViewMode, TabMode } from "../../../pages/user/search/SearchPage";
import { calculateDocumentRating } from "../../../utils/CalcRate";

const { Option } = Select;

interface SearchResultsProps {
  documents: Document[];
  subjects?: Subject[]; // Optional, only needed if displaying subjects
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  viewMode: ViewMode;
  searchQuery: string;
  currentTab: TabMode;
  isShowingFallback?: boolean;
  onPageChange: (page: number) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (ordering: string, order: 1 | -1) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  documents,
  subjects,
  loading,
  total,
  currentPage,
  pageSize,
  viewMode,
  searchQuery,
  currentTab,
  isShowingFallback = false,
  onPageChange,
  onViewModeChange,
  onSortChange,
}) => {
  const handleSortChange = (value: string) => {
    const [ordering, orderStr] = value.split(":");
    const order = orderStr === "desc" ? -1 : 1;
    onSortChange(ordering, order);
  };

  return (
    <div className="space-y-4">
      <div className="text-center md:text-left">
        <h2 className="text-lg font-semibold text-[var(--primary-text-color)] mb-1 text-center md:text-left">
          {currentTab === "subjects"
            ? "Danh sách môn học"
            : isShowingFallback
            ? `Không tìm thấy tài liệu này với từ khóa "${searchQuery}". Dưới đây là đề xuất cho bạn:`
            : "Kết quả tìm kiếm"}
          {searchQuery && currentTab === "all" && !isShowingFallback && (
            <span className="text-[var(--primary-color)] ml-2">
              "{searchQuery}"
            </span>
          )}
        </h2>
      </div>

      {/* Results Content */}
      {currentTab === "subjects" ? (
        /* Subject Grid Only */
        loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : subjects && subjects.length > 0 ? (
          <SubjectGrid
            title=""
            subjects={subjects}
            onSubjectClick={(subject: Subject) => {
              // Navigate to subject documents page
              window.location.href = `/subject/${subject._id}/documents`;
            }}
          />
        ) : (
          <Empty
            description={
              <div className="text-center">
                <p className="text-[var(--color-gray-text)] mb-2">
                  Không tìm thấy môn học nào phù hợp
                </p>
                <p className="text-sm text-[var(--third-text-color)]">
                  Thử thay đổi từ khóa tìm kiếm
                </p>
              </div>
            }
            className="py-12"
          />
        )
      ) : (
        <>
          {/* Subject Grid for All tab */}
          {subjects && subjects.length > 0 && (
            <SubjectGrid
              title="Môn học"
              subjects={subjects}
              onSubjectClick={(subject) => {
                // Navigate to subject documents page
                window.location.href = `/subject/${subject._id}/documents`;
              }}
            />
          )}
          {/* Controls */}
          <div className="bg-[var(--primary-background-color)]">
            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--secondary-text-color)]">
                    Sắp xếp:
                  </span>
                  <Select
                    placeholder="Chọn cách sắp xếp"
                    onChange={handleSortChange}
                    className="w-full sm:w-40"
                    size="small"
                    defaultValue="createdAt:desc"
                  >
                    <Option value="createdAt:desc">Mới nhất</Option>
                    <Option value="createdAt:asc">Cũ nhất</Option>
                    <Option value="view:desc">Lượt xem nhiều</Option>
                    <Option value="download_count:desc">Lượt tải nhiều</Option>
                    <Option value="title:asc">Tên A-Z</Option>
                    <Option value="title:desc">Tên Z-A</Option>
                  </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--secondary-text-color)]">
                    Hiển thị:
                  </span>
                  <div className="flex border border-[var(--border-color)] rounded">
                    <Button
                      type={viewMode === "grid" ? "primary" : "default"}
                      size="small"
                      icon={<Grid className="w-4 h-4" />}
                      onClick={() => onViewModeChange("grid")}
                      className="border-0 rounded-r-none"
                    >
                      Lưới
                    </Button>
                    <Button
                      type={viewMode === "list" ? "primary" : "default"}
                      size="small"
                      icon={<List className="w-4 h-4" />}
                      onClick={() => onViewModeChange("list")}
                      className="border-0 rounded-l-none"
                    >
                      Cột
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Documents Section */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
            </div>
          ) : documents.length === 0 ? (
            <Card>
              <Empty
                description={
                  <div className="text-center">
                    <p className="text-[var(--color-gray-text)] mb-2">
                      {isShowingFallback
                        ? `Không tìm thấy tài liệu này với từ khóa "${searchQuery}"`
                        : "Không tìm thấy tài liệu nào phù hợp"}
                    </p>
                    {isShowingFallback && (
                      <p className="text-sm text-[var(--third-text-color)]">
                        Dưới đây là đề xuất cho bạn
                      </p>
                    )}
                    {!isShowingFallback && (
                      <p className="text-sm text-[var(--third-text-color)]">
                        Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                      </p>
                    )}
                  </div>
                }
                className="py-12"
              />
            </Card>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center">
                  {documents.map((document) => (
                    <DocumentCard key={document._id} document={document} />
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <Card>
                  <div className="">
                    {documents.map((document) => (
                      <div
                        key={document._id}
                        className="cursor-pointer hover:bg-[var(--secondary-background-color)] rounded"
                        onClick={() =>
                          (window.location.href = `/document-detail/${document._id}`)
                        }
                      >
                        <RecentItem
                          title={document.title}
                          views={document.view}
                          rating={
                            calculateDocumentRating(
                              document.like || 0,
                              document.dislike || 0
                            ).ratingPercentage
                          }
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

              {/* Pagination - Only for documents tab */}
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
        </>
      )}
    </div>
  );
};

export default SearchResults;
