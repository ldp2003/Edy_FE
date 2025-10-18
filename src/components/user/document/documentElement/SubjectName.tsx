import React from "react";
import { BookOpen } from "lucide-react";

type SubjectNameProps = {
  subject: string;
};

const SubjectName: React.FC<SubjectNameProps> = ({ subject }) => {
  return (
    <div className="flex items-center justify-center bg-[var(--third-background-color)] text-[var(--primary-text-color)] rounded-full px-4 py-[1px] text-[10px] font-bold w-fit mx-auto">
      <BookOpen size={12} />
      <span className="ml-2 align-middle">{subject}</span>
    </div>
  );
};

export default SubjectName;
