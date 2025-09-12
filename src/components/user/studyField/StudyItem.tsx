import React from "react";
import { Edit, Trash } from "lucide-react";

type StudyItemProps = {
  title: string;
};

const StudyItem: React.FC<StudyItemProps> = ({ title }) => {
  return (
    <div className="flex justify-between items-center py-2 border-b">
      <span className="text-gray-800 text-sm">{title}</span>
      <div className="flex items-center gap-2">
        <button className="text-blue-500 hover:text-blue-700">
          <Edit size={16} />
        </button>
        <button className="text-red-500 hover:text-red-700">
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};

export default StudyItem;
