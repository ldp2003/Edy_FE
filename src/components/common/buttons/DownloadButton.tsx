import { CloudDownload } from "lucide-react";
import React from "react";

const DownloadButton: React.FC<{ point: number }> = ({ point }) => {
  return (
    <div className="flex flex-row items-center space-x-2">
      <button className="cursor-pointer text-xs bg-[var(--green-button-color)] hover:bg-green-700 flex flex-row items-center gap-4 text-white font-semibold py-2 px-4 rounded-2xl">
        <CloudDownload size={15} />
        Tải về / {point} UP
      </button>
    </div>
  );
};

export default DownloadButton;
