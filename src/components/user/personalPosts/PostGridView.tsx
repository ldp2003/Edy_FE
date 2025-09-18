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

const PostGridView: React.FC = () => {
  // Extended data for demonstration (same as PostTable)
  const data: Post[] = [
    {
      key: "1",
      index: 1,
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      views: 0,
      comments: 0,
      rating: "0%",
      status: "Đã duyệt",
      mode: "Công khai",
    },
    {
      key: "2",
      index: 2,
      title: "Tài liệu tổng hợp Triết học Mác Lênin",
      views: 10,
      comments: 2,
      rating: "80%",
      status: "Đã duyệt",
      mode: "Công khai",
    },
    {
      key: "3",
      index: 3,
      title: "Tài liệu tổng hợp Lịch sử Đảng",
      views: 5,
      comments: 1,
      rating: "60%",
      status: "Đang chờ duyệt",
      mode: "Công khai",
    },
    {
      key: "4",
      index: 4,
      title: "Tài liệu tổng hợp Kinh tế học",
      views: 20,
      comments: 5,
      rating: "90%",
      status: "Đã duyệt",
      mode: "Cá nhân",
    },
    {
      key: "5",
      index: 5,
      title: "Tài liệu tổng hợp Văn học Việt Nam",
      views: 15,
      comments: 3,
      rating: "70%",
      status: "Từ chối duyệt",
      mode: "Chia sẻ giới hạn",
    },
    {
      key: "6",
      index: 6,
      title: "Tài liệu tổng hợp Toán học cao cấp",
      views: 25,
      comments: 7,
      rating: "95%",
      status: "Đã duyệt",
      mode: "Công khai",
    },
    {
      key: "7",
      index: 7,
      title: "Tài liệu tổng hợp Vật lý đại cương",
      views: 12,
      comments: 4,
      rating: "85%",
      status: "Đã duyệt",
      mode: "Công khai",
    },
    {
      key: "8",
      index: 8,
      title: "Tài liệu tổng hợp Hóa học hữu cơ",
      views: 8,
      comments: 2,
      rating: "75%",
      status: "Đang chờ duyệt",
      mode: "Cá nhân",
    },
  ];

  // Generate description based on post data
  const getDescription = (post: Post) => {
    return `${post.views} lượt xem • ${post.comments} bình luận • Đánh giá: ${post.rating} • Trạng thái: ${post.status}`;
  };

  return (
    <div className="w-full">
      {/* Grid content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((post) => (
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
