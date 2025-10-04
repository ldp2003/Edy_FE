import React, { useState, useEffect } from "react";
import { Card, Spin, Empty } from "antd";
import { BookOpen } from "lucide-react";
import SubjectItem from "../subject/SubjectItem";
import type { Subject } from "../../../models/subject";

// TODO: Thay thế bằng SubjectService khi có API
const mockSubjects: Partial<Subject>[] = [
  {
    _id: "1",
    name: "Kinh tế chính trị Mác Lênin",
    code: "KTCT",
    doc_count: 25,
  },
  {
    _id: "2",
    name: "Toán cao cấp",
    code: "TCC",
    doc_count: 18,
  },
  {
    _id: "3",
    name: "Lập trình căn bản",
    code: "LTCB",
    doc_count: 32,
  },
  {
    _id: "4",
    name: "Cơ sở dữ liệu",
    code: "CSDL",
    doc_count: 15,
  },
  {
    _id: "5",
    name: "Mạng máy tính",
    code: "MMT",
    doc_count: 22,
  },
  {
    _id: "6",
    name: "Kỹ thuật phần mềm",
    code: "KTPM",
    doc_count: 28,
  },
];

const SubjectSection: React.FC = () => {
  const [subjects, setSubjects] = useState<Partial<Subject>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Thay thế bằng API call thực
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSubjects(mockSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSubjectClick = (subject: Subject) => {
    // Navigate to subject page with search results
    window.location.href = `/search?subject=${subject._id}&q=`;
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>Môn học phổ biến</span>
        </div>
      }
      size="small"
      className="sticky top-4"
    >
      {loading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : subjects.length === 0 ? (
        <Empty description="Chưa có môn học nào" />
      ) : (
        <div className="space-y-2">
          {subjects.map((subject) => (
            <div
              key={subject._id}
              className="border border-gray-100 rounded p-2 hover:border-blue-300 transition-colors"
            >
              <SubjectItem
                subject={subject as Subject}
                onClick={handleSubjectClick}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={() => (window.location.href = "/subjects")}
        >
          Xem tất cả môn học →
        </button>
      </div>
    </Card>
  );
};

export default SubjectSection;
