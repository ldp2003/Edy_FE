import React from "react";
import { Card, Pagination, Empty, Spin, Select, Button } from "antd";
import { Grid, List } from "lucide-react";
import DocumentCard from "../documentCard/DocumentCard";
import RecentItem from "../documentCard/RecentItem";
import type { Document } from "../../../../models/document";
import { calculateDocumentRating } from "../../../../utils/CalcRate";

const { Option } = Select;

export type ViewMode = "grid" | "list";

interface DocumentListResultsProps {
  documents: Document[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  viewMode: ViewMode;
  onPageChange: (page: number) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onSortChange: (ordering: string, order: 1 | -1) => void;
}

const DocumentListResults: React.FC<DocumentListResultsProps> = ({
  documents,
  loading,
  total,
  currentPage,
  pageSize,
  viewMode,
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
      {/* Controls */}
      <div className="bg-white">
        <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sắp xếp:</span>
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
                  Không có tài liệu nào để hiển thị
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4 justify-items-center">
              {documents
                .filter((doc) => doc && doc._id)
                .map((document) => (
                  <DocumentCard key={document._id} document={document} />
                ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <Card>
              <div className="">
                {documents
                  .filter((doc) => doc && doc._id)
                  .map((document) => (
                    <div
                      key={document._id}
                      className="cursor-pointer hover:bg-gray-50 rounded"
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
                        fileType={document.file_type}
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

export default DocumentListResults;
