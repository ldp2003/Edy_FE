import React, { useState } from "react";
import StudyItem from "./StudyItem";

const StudyList: React.FC = () => {
  const items = [
    "Công nghệ thông tin",
    "ReactJS",
    "Nghiên cứu khoa học",
    "Tiểu luận",
    "Lập trình hướng đối tượng",
    "Công nghệ thông tin",
    "ReactJS",
    "Nghiên cứu khoa học",
    "Tiểu luận",
    "Lập trình hướng đối tượng",
  ];

  const [visibleCount, setVisibleCount] = useState(5);

  const handleExpand = () => {
    setVisibleCount(items.length);
  };

  return (
    <div
      className="h-full p-4 rounded-lg"
      style={{ backgroundColor: "var(--card-background-color)" }}
    >
      {items.slice(0, visibleCount).map((item, index) => (
        <StudyItem key={index} title={item} />
      ))}
      {visibleCount < items.length && (
        <div className="text-center mt-4">
          <button
            className=" hover:underline"
            style={{ color: "var(--primary-color)" }}
            onClick={handleExpand}
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyList;
