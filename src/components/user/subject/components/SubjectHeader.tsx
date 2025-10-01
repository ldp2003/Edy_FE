import React from "react";
import { BookOpen, School, Calendar } from "lucide-react";
import type { Subject } from "../../../../models/subject";

interface SubjectHeaderProps {
  subject: Subject;
  totalDocuments: number;
}

const SubjectHeader: React.FC<SubjectHeaderProps> = ({
  subject,
  totalDocuments,
}) => {
  return (
    <div className="bg-white text-left rounded-lg border border-gray-200 p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
          <BookOpen size={26} className="text-[var(--primary-color)]" />
        </div>

        <div className="flex-1">
          <h1 className="text-xl font-bold text-[var(--primary-text-color)] mb-2">
            {subject.name}
          </h1>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <School size={12} />
              <span className="text-xs">{subject.organization.name}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span className="text-xs">Mã môn học: {subject.code}</span>
            </div>

            <div className="flex items-center gap-1">
              <BookOpen size={12} />
              <span className="text-xs font-medium">
                {totalDocuments} tài liệu
              </span>
            </div>
          </div>

          {subject.description && (
            <p className="text-gray-700 mt-3 text-sm">{subject.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectHeader;
