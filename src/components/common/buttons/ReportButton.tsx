import { Flag } from "lucide-react";
import React from "react";

const ReportButton: React.FC = () => {
  return (
    <div>
      <button className="text-xs flex items-center space-x-2 rounded-2xl border border-gray-300 px-3 py-1 bg-white font-semibold cursor-pointer text-[var(--red-button-color)] transition-colors duration-300 hover:bg-[#d63847] hover:text-white">
        <Flag size={15} />
        <span className="text-xs">Báo cáo</span>
      </button>
    </div>
  );
};

export default ReportButton;
