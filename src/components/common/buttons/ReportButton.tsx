import { Flag } from "lucide-react";
import React from "react";

const ReportButton: React.FC = () => {
  return (
    <div className="">
      <button className="cursor-pointer flex items-center space-x-2 rounded-2xl border border-gray-300 px-3 py-1 bg-white hover:bg-gray-100 font-semibold">
        <Flag className="w-4 h-4" />
        <span>Báo cáo</span>
      </button>
    </div>
  );
};

export default ReportButton;
