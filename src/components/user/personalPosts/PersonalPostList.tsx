import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostTable from "./PostTable";
import PostListView from "./PostListView";
import PostGridView from "./PostGridView";
import UploadButton from "../../common/buttons/UploadButton";

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
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    import("../../../utils/DocumentService").then(({ DocumentService }) => {
      DocumentService.getMyDocuments()
        .then((data) => {
          if (mounted) {
            // Map dữ liệu BE sang Post[]
            const docs = Array.isArray(data?.documents)
              ? data.documents.map((doc: any, idx: number) => ({
                  key: doc._id,
                  index: idx + 1,
                  title: doc.title,
                  views: doc.view,
                  comments: doc.comment_count,
                  rating: "0%", // Nếu có trường rating thì lấy, không thì để mặc định
                  status: doc.status,
                  mode: doc.file_type,
                  public_mode: doc.public_mode,
                  url: doc.url,
                  createdAt: doc.createdAt,
                }))
              : [];
            setDocuments(docs);
          }
        })
        .catch(() => setDocuments([]))
        .finally(() => mounted && setLoading(false));
    });
    return () => {
      mounted = false;
    };
  }, []);

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
    </div>
  );
};

export default PersonalPostList;
