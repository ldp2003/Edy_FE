import React from "react";
import { School, FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  createSubjectSlug,
  storeSubjectMapping,
} from "../../../utils/SlugUtils";
import type { Subject } from "../../../models/subject";

interface SubjectItemProps {
  subject: Subject;
  onClick?: (subject: Subject) => void;
}

const SubjectItem: React.FC<SubjectItemProps> = ({ subject, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Create slug and navigate to subject documents page
    const slug = createSubjectSlug(subject.name);
    // Store mapping for later retrieval
    storeSubjectMapping(subject.name, subject._id);
    navigate(`/subject/${slug}/documents`);

    // Also call the onClick if provided for any additional handling
    if (onClick) {
      onClick(subject);
    }
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* Header với icon và tiêu đề */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded">
          <FolderOpen size={16} className="text-[var(--primary-color)]" />
        </div>
        <span className="text-sm font-medium text-[var(--primary-color)]">
          Môn học
        </span>
      </div>

      {/* Tên môn học */}
      <h3 className="text-sm font-semibold text-gray-900 mb-2 truncate">
        {subject.name}
      </h3>

      {/* Thông tin tổ chức */}
      <div className="flex items-center gap-2 text-gray-600">
        <School size={14} />
        <span
          className="text-xs truncate cursor-pointer hover:text-blue-600 transition-colors"
          onClick={(e) => {
            e.stopPropagation(); // Prevent parent click event
            if (subject.organization && subject.organization._id) {
              navigate(`/organization/${subject.organization._id}`);
            }
          }}
        >
          {subject.organization.name}
        </span>
      </div>
    </div>
  );
};

export default SubjectItem;
