import React from "react";
import { useNavigate } from "react-router-dom";
import DocumentCard from "../document/documentCard/DocumentCard";
import {
  getStatusText,
  getPublicModeText,
} from "../../../locales/translationUtils";
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

interface PostGridViewProps {
  data: Post[];
  loading?: boolean;
}

const PostGridView: React.FC<PostGridViewProps> = ({ data, loading }) => {
  const navigate = useNavigate();

  // Nếu loading, hiển thị skeleton hoặc rỗng
  const displayData = loading ? [] : data;

  // Generate description based on post data
  const getDescription = (post: Post) => {
    const statusText = getStatusText(post.status);
    const modeText = getPublicModeText(post.public_mode);
    return `${post.views} lượt xem • ${post.comments} bình luận • Đánh giá: ${post.rating} • Trạng thái: ${statusText} • Chế độ: ${modeText}`;
  };

  return (
    <div className="w-full">
      {/* Grid content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayData.map((post) => (
          <div
            key={post.key}
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate(`/personal-posts/${post.key}`)}
          >
            <DocumentCard
              title={post.title}
              description={getDescription(post)}
              imageUrl="/public/image/thumb_1200_1553.png"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostGridView;
