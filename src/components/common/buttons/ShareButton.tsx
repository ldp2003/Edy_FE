import { Forward } from "lucide-react";
import React from "react";

const ShareButton: React.FC = () => {
  return (
    <div className="text-xs flex items-center space-x-2 rounded-2xl border border-gray-300 px-3 py-1 bg-white font-semibold cursor-pointer text-blue-600 transition-colors duration-300 hover:bg-blue-600 hover:text-white">
      <Forward size={15} />
      <span className="text-xs">Chia sẻ</span>
    </div>
  );
};

export default ShareButton;
