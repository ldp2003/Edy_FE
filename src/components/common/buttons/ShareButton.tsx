import { Forward } from "lucide-react";
import React from "react";

const ShareButton: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 rounded-2xl border border-gray-300 px-3 py-1 bg-white hover:bg-gray-100 font-semibold cursor-pointer">
      <Forward />
    </div>
  );
};

export default ShareButton;
