import React, { useState } from "react";
import StudyItem from "./StudyItem";

type StudyListProps = {
  fieldOfStudy: string[];
};

const StudyList: React.FC<StudyListProps> = ({ fieldOfStudy }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const handleExpand = () => {
    setVisibleCount(fieldOfStudy.length);
  };

  return (
    <div
      className="h-full p-4 rounded-lg"
      style={{ backgroundColor: "var(--card-background-color)" }}
    >
      {fieldOfStudy.slice(0, visibleCount).map((item, index) => (
        <StudyItem key={index} title={item} />
      ))}
      {visibleCount < fieldOfStudy.length && (
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
