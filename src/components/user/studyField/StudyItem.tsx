import React from "react";
import { Edit, Trash } from "lucide-react";

type StudyItemProps = {
  title: string;
};

const StudyItem: React.FC<StudyItemProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <span className="text-gray-800 text-sm">{title}</span>
      <div className="flex items-center gap-2 ">
        <button
          className=" hover:text-blue-700 cursor-pointer"
          style={{ color: "var(--primary-color)" }}
        >
          <Edit size={20} />
        </button>
        <button
          className=" hover:text-red-700 cursor-pointer"
          style={{ color: "var(--red-button-color)" }}
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
};

export default StudyItem;
