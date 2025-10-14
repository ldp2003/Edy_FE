import React from "react";
import { Card, Pagination, Empty, Spin, Select, Button } from "antd";
import { Grid, List } from "lucide-react";
import DocumentCard from "../document/documentCard/DocumentCard";
import RecentItem from "../document/documentCard/RecentItem";
import SubjectGrid from "../subject/SubjectGrid";
import type { Document } from "../../../models/document";
import type { Subject } from "../../../models/subject";
import type { ViewMode, TabMode } from "../../../pages/user/search/SearchPage";
import { fetchMultipleDocumentRatings } from "../../../utils/CalcRate";

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
  onPageChange,
  onViewModeChange,
  onSortChange,
}) => {
  const [documentRatings, setDocumentRatings] = React.useState<
    Map<string, { ratingPercentage: number; formattedRating: string }>
  >(new Map());

  // Fetch ratings when documents change
  React.useEffect(() => {
    const fetchRatings = async () => {
      if (documents && documents.length > 0) {
        try {
          const documentIds = documents.map((doc) => doc._id);
          const ratingsMap = await fetchMultipleDocumentRatings(documentIds);
          setDocumentRatings(ratingsMap);
        } catch (error) {
          console.error("Error fetching document ratings:", error);
          setDocumentRatings(new Map());
        }
      } else {
        setDocumentRatings(new Map());
      }
    };

    fetchRatings();
  }, [documents]);

  const handleSortChange = (value: string) => {
    const [ordering, orderStr] = value.split(":");
    const order = orderStr === "desc" ? -1 : 1;
    onSortChange(ordering, order);
  };
  

  return (
    <div className="space-y-4">
      {/* Header Title - Top Left */}
      <div className="text-left">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {currentTab === "subjects" ? "Danh sách môn học" : "Kết quả tìm kiếm"}
          {searchQuery && currentTab === "all" && (
            <span className="text-blue-600 ml-2">"{searchQuery}"</span>
          )}
        </h2>
        <p className="text-sm text-gray-600">
          {currentTab === "subjects"
            ? `Hiển thị ${total.toLocaleString()} môn học`
            : `Tìm thấy ${total.toLocaleString()} tài liệu`}
        </p>
      </div>

      {/* Results Content */}
      {currentTab === "subjects" ? (
        /* Subject Grid Only */
        <SubjectGrid
          title=""
          subjects={subjects}
          onSubjectClick={(subject) => {
            // Navigate to subject documents page
            window.location.href = `/subject/${subject._id}/documents`;
          }}
        />
      ) : (
        <>
          {/* Subject Grid for All tab */}
          <SubjectGrid
            title="Môn học"
            subjects={subjects}
            onSubjectClick={(subject) => {
              // Navigate to subject documents page
              window.location.href = `/subject/${subject._id}/documents`;
            }}
          />
          {/* Controls */}
          <div className="bg-white">
            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sắp xếp:</span>
                  <Select
                    placeholder="Chọn cách sắp xếp"
                    onChange={handleSortChange}
                    className="w-40"
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
                  <span className="text-sm text-gray-600">Hiển thị:</span>
                  <div className="flex border border-gray-300 rounded">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {documents.map((document) => (
                    <DocumentCard
                      key={document._id}
                      title={document.title}
                      description={`${document.page || 0} trang • ${
                        document.view || 0
                      } lượt xem • ${document.download_count || 0} lượt tải`}
                      imageUrl={document.cover_page}
                      document={document}
                    />
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
                        className="cursor-pointer hover:bg-gray-50 rounded"
                        onClick={() =>
                          (window.location.href = `/documents/${document._id}`)
                        }
                      >
                        <RecentItem
                          title={document.title}
                          views={document.view}
                          rating={
                            documentRatings.get(document._id)
                              ?.ratingPercentage || 0
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
