import React from "react";
import { Card } from "antd";
import { BookOpen } from "lucide-react";

interface SubjectItem {
  subject: {
    _id: string;
    name: string;
  };
  count: number;
}

interface AdminSubjectCardProps {
  subject: SubjectItem;
  onClick: (subjectId: string) => void;
}

const AdminSubjectCard: React.FC<AdminSubjectCardProps> = ({
  subject,
  onClick,
}) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 border hover:border-[var(--primary-color)]"
      style={{
        backgroundColor: "var(--secondary-background-color)",
        borderColor: "var(--border-color)",
      }}
      onClick={() => onClick(subject.subject._id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="p-2 rounded-lg"
              style={{
                backgroundColor: "var(--field-background-color)",
              }}
            >
              <BookOpen
                className="w-4 h-4"
                style={{ color: "var(--primary-color)" }}
              />
            </div>
            <h4
              className="font-semibold text-sm truncate"
              style={{ color: "var(--primary-text-color)" }}
            >
              {subject.subject.name}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--secondary-text-color)" }}
            >
              {subject.count} tài liệu
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdminSubjectCard;
