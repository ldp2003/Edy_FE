import React from "react";
import DocumentCard from "../document/documentCard/DocumentCard";
interface Post {
  key: string;
  index: number;
  title: string;
  views: number;
  comments: number;
  rating: string;
  status: string;
  mode: string;
}

interface PostGridViewProps {
  data: Post[];
  loading?: boolean;
}

const PostGridView: React.FC<PostGridViewProps> = ({ data, loading }) => {
  // Nếu loading, hiển thị skeleton hoặc rỗng
  const displayData = loading ? [] : data;

  // Generate description based on post data
  const getDescription = (post: Post) => {
    return `${post.views} lượt xem • ${post.comments} bình luận • Đánh giá: ${post.rating} • Trạng thái: ${post.status}`;
  };

  return (
    <div className="w-full">
      {/* Grid content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayData.map((post) => (
          <DocumentCard
            key={post.key}
            title={post.title}
            description={getDescription(post)}
            imageUrl="/public/image/thumb_1200_1553.png"
          />
        ))}
      </div>
    </div>
  );
};

export default PostGridView;
