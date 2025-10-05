import React from "react";
import { Card } from "antd";

// Mock data for subjects - replace with actual API call
const mockSubjects = [
  {
    _id: "1",
    name: "Kinh tế chính trị Mác Lênin",
    organization: "Trường Đại học Công nghiệp Thành phố Hồ Chí Minh",
    documentCount: 25,
  },
  {
    _id: "2",
    name: "Triết học Mác Lênin",
    organization: "Trường Đại học Công nghiệp Thành phố Hồ Chí Minh",
    documentCount: 18,
  },
  {
    _id: "3",
    name: "Lịch sử Đảng Cộng sản Việt Nam",
    organization: "Trường Đại học Công nghiệp Thành phố Hồ Chí Minh",
    documentCount: 32,
  },
  {
    _id: "4",
    name: "Pháp luật đại cương",
    organization: "Trường Đại học Bách Khoa TP.HCM",
    documentCount: 15,
  },
  {
    _id: "5",
    name: "Tin học đại cương",
    organization: "Trường Đại học Bách Khoa TP.HCM",
    documentCount: 42,
  },
  {
    _id: "6",
    name: "Toán cao cấp",
    organization: "Trường Đại học Khoa học Tự nhiên",
    documentCount: 67,
  },
];

interface SubjectListProps {
  viewMode: "grid" | "list";
  onSubjectClick?: (subjectId: string) => void;
}

const SubjectList: React.FC<SubjectListProps> = ({
  viewMode,
  onSubjectClick,
}) => {
  const handleSubjectClick = (subjectId: string) => {
    if (onSubjectClick) {
      onSubjectClick(subjectId);
    } else {
      // Navigate to subject documents page
      window.location.href = `/subject/${subjectId}/documents`;
    }
  };

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockSubjects.map((subject) => (
          <Card
            key={subject._id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleSubjectClick(subject._id)}
          >
            <div className="p-2">
              <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
                📚 {subject.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                🏫 {subject.organization}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-600 font-medium">
                  {subject.documentCount} tài liệu
                </span>
                <span className="text-gray-500">Xem tài liệu →</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-3">
      {mockSubjects.map((subject) => (
        <Card
          key={subject._id}
          className="hover:shadow-sm transition-shadow cursor-pointer"
          onClick={() => handleSubjectClick(subject._id)}
        >
          <div className="flex items-center justify-between p-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-base mb-1">
                📚 {subject.name}
              </h3>
              <p className="text-sm text-gray-600">🏫 {subject.organization}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-600 font-medium">
                {subject.documentCount} tài liệu
              </div>
              <div className="text-xs text-gray-500 mt-1">Xem tài liệu →</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SubjectList;
