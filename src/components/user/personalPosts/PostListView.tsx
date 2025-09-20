import React from "react";
import { useNavigate } from "react-router-dom";
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
  public_mode: string;
  url: string;
  createdAt: string;
}

interface PostListViewProps {
  data: Post[];
  loading?: boolean;
}

const PostListView: React.FC<PostListViewProps> = ({ data, loading }) => {
  const navigate = useNavigate();

  // Nếu loading, hiển thị skeleton hoặc rỗng
  const displayData = loading ? [] : data;

  return (
    <div className="w-full">
      {/* List content */}
      <div className="space-y-2">
        {displayData.map((post) => (
          <div
            key={post.key}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => navigate(`/personal-posts/${post.key}`)}
          >
            <RecentItem
              title={post.title}
              views={post.views}
              rating={parseInt(post.rating.replace("%", ""))}
              pages={Math.floor(Math.random() * 50) + 10}
              date="2024-09-18"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostListView;
