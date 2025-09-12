import React from "react";
import RecentItem from "./RecentItem";

const RecentDocument: React.FC = () => {
  const recentDocs = [
    {
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      views: 100,
      rating: 84,
      pages: 54,
      date: "03/09/2025",
    },
    {
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      views: 100,
      rating: 84,
      pages: 54,
      date: "03/09/2025",
    },
    {
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      views: 100,
      rating: 84,
      pages: 54,
      date: "03/09/2025",
    },
    {
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      views: 100,
      rating: 84,
      pages: 54,
      date: "03/09/2025",
    },
    {
      title: "Tài liệu tổng hợp Kinh tế chính trị Mác Lênin",
      views: 100,
      rating: 84,
      pages: 54,
      date: "03/09/2025",
    },
  ];

  return (
    <div className="border-l pl-4">
      {recentDocs.map((doc, index) => (
        <RecentItem key={index} {...doc} />
      ))}
    </div>
  );
};

export default RecentDocument;
