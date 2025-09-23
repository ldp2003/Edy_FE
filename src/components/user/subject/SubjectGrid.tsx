import React from "react";
import SubjectItem from "./SubjectItem";
import type { Subject } from "../../../models/subject";

interface SubjectGridProps {
  title: string;
  subjects: Subject[];
  onSubjectClick?: (subject: Subject) => void;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({
  title,
  subjects,
  onSubjectClick,
}) => {
  if (!subjects || subjects.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 text-left">
      <h2 className="text-base font-bold text-[var(--primary-text-color)] mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subjects.map((subject) => (
          <SubjectItem
            key={subject._id}
            subject={subject}
            onClick={onSubjectClick}
          />
        ))}
      </div>
    </div>
  );
};

export default SubjectGrid;
