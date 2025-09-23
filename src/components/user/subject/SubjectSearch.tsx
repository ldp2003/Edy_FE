import React from "react";
import { FolderOpen, FileText } from "lucide-react";
import type { Subject } from "../../../models/subject";

interface SubjectElementProps {
  subject: Subject;
  documentCount?: number;
  onClick?: (subject: Subject) => void;
}

const SubjectElement: React.FC<SubjectElementProps> = ({
  subject,
  documentCount = 0,
  onClick,
}) => {
  const handleClick = () => {
    onClick?.(subject);
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* Header với icon và tiêu đề */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded">
          <FolderOpen size={12} className="text-blue-600" />
        </div>
        <span className="text-xs font-medium text-blue-600">Môn học</span>
      </div>

      {/* Tên môn học */}
      <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
        {subject.name}
      </h4>

      {/* Số tài liệu */}
      <div className="flex items-center gap-2 text-gray-600">
        <FileText size={12} />
        <span className="text-xs">{documentCount} tài liệu</span>
      </div>
    </div>
  );
};

export default SubjectElement;
