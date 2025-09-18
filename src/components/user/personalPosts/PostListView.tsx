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

const PostListView: React.FC = () => {
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

  return (
    <div className="w-full">
      {/* List content */}
      <div className="space-y-2">
        {data.map((post) => (
          <RecentItem
            key={post.key}
            title={post.title}
            views={post.views}
            rating={parseInt(post.rating.replace("%", ""))}
            pages={Math.floor(Math.random() * 50) + 10} // Random page count for demo
            date="2024-09-18"
          />
        ))}
      </div>
    </div>
  );
};

export default PostListView;
