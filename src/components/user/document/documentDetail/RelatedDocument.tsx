import React from "react";
import SuggestCard from "../documentCard/SuggestCard";

const featuredDocuments = [
  {
    id: "1",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
    imageUrl: "/image/thumb_1200_1553.png",
    like: 160,
  },
  {
    id: "2",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
    imageUrl: "/image/thumb_1200_1553.png",
    like: 160,
  },
  {
    id: "3",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
    imageUrl: "/image/thumb_1200_1553.png",
    like: 160,
  },
  {
    id: "4",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
    imageUrl: "/image/thumb_1200_1553.png",
    like: 160,
  },
  {
    id: "5",
    title: "Tài liệu tổng hợp Kinh tế chính trị Mác-Lênin",
    description: "Kinh tế chính trị Mác-Lênin",
    imageUrl: "/image/thumb_1200_1553.png",
    like: 160,
  },
];

const RelatedDocument: React.FC = () => {
  return (
    <div className="pt-6">
      <h4 className="font-medium text-lg mb-3">Gợi ý cho bạn:</h4>
      <div className="space-y-3">
        {featuredDocuments.map((doc) => (
          <SuggestCard
            key={doc.id}
            id={doc.id}
            title={doc.title}
            description={doc.description}
            imageUrl={doc.imageUrl}
            like={doc.like}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedDocument;
