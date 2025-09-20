import React from "react";
import RecentItem from "../document/documentCard/RecentItem";

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

interface PostListViewProps {
  data: Post[];
  loading?: boolean;
}

const PostListView: React.FC<PostListViewProps> = ({ data, loading }) => {
  // Nếu loading, hiển thị skeleton hoặc rỗng
  const displayData = loading ? [] : data;

  return (
    <div className="w-full">
      {/* List content */}
      <div className="space-y-2">
        {displayData.map((post) => (
          <RecentItem
            key={post.key}
            title={post.title}
            views={post.views}
            rating={parseInt(post.rating.replace("%", ""))}
            pages={Math.floor(Math.random() * 50) + 10}
            date="2024-09-18"
          />
        ))}
      </div>
    </div>
  );
};

export default PostListView;
