import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import PostTable from "./PostTable";
import PostListView from "./PostListView";
import PostGridView from "./PostGridView";
import UploadButton from "../../common/buttons/UploadButton";
import type { Document } from "../../../models/document";
import { DocumentService } from "../../../utils/DocumentService";

interface Post {
  key: string;
  index: number;
  title: string;
  views: number;
  comments: number;
  rating: string;
  status: string;
  mode: string;
  public_mode: string;
  url: string;
  createdAt: string;
}

const PersonalPostList: React.FC = () => {
  const [viewMode, setViewMode] = useState("table");
  const [documents, setDocuments] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);

    const apiParams = {
      page: currentPage,
      limit: pageSize,
    };

    console.log("API Params:", apiParams); // Debug log

    DocumentService.getMyDocuments(apiParams)
      .then((data) => {
        console.log("API Response:", data); // Debug log
        if (mounted) {
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
              }))
            : [];
          setDocuments(docs);
          setTotal(data?.total || 0);
        }
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
        setDocuments([]);
        setTotal(0);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [currentPage, pageSize]);
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
    <div className="">
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
  );
};

export default PersonalPostList;
