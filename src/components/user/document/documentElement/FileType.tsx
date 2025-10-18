import React from "react";
import { FileText } from "lucide-react";

type FileTypeProps = {
  fileType: string;
};

const FileType: React.FC<FileTypeProps> = ({ fileType }) => {
  // Định nghĩa màu sắc cho từng loại file (chỉ có 5 loại trong FileType constants)
  const getFileTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "PDF":
        return "bg-red-100 text-red-700";
      case "WORD":
        return "bg-blue-100 text-blue-700";
      case "EXCEL":
        return "bg-green-100 text-green-700";
      case "POWERPOINT":
        return "bg-orange-100 text-orange-700";
      case "VIDEO":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      className={`flex items-center justify-center ${getFileTypeColor(
        fileType
      )} rounded-full px-4 py-[1px] text-[10px] font-bold w-fit mx-auto`}
    >
      <FileText size={12} />
      <span className="ml-2 align-middle">{fileType}</span>
    </div>
  );
};

export default FileType;
