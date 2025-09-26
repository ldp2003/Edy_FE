import React from "react";
import { BookOpen } from "lucide-react";
import { Pagination } from "antd";
import SubjectItem from "../../../subject/SubjectItem";
import type { Subject } from "../../../../../models/subject";

interface OrganizationSubjectsProps {
  subjects: Subject[];
  totalSubjects: number;
  subjectPage: number;
  subjectsPerPage: number;
  onPageChange: (page: number) => void;
  onSubjectClick: (subject: Subject) => void;
}

const OrganizationSubjects: React.FC<OrganizationSubjectsProps> = ({
  subjects,
  totalSubjects,
  subjectPage,
  subjectsPerPage,
  onPageChange,
  onSubjectClick,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-[var(--primary-color)]" />
            <h2 className="text-base font-semibold text-[var(--primary-text-color)]">
              Các môn học ({totalSubjects})
            </h2>
          </div>
          {subjects.length > subjectsPerPage && (
            <Pagination
              current={subjectPage}
              total={subjects.length}
              pageSize={subjectsPerPage}
              onChange={onPageChange}
              showSizeChanger={false}
              size="small"
            />
          )}
        </div>

        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects
              .slice(
                (subjectPage - 1) * subjectsPerPage,
                subjectPage * subjectsPerPage
              )
              .map((subject) => (
                <SubjectItem
                  key={subject._id}
                  subject={subject}
                  onClick={onSubjectClick}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-base font-semibold text-gray-600 mb-2">
              Chưa có môn học nào
            </h3>
            <p className="text-gray-500">
              Tổ chức này chưa có môn học được tạo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationSubjects;
