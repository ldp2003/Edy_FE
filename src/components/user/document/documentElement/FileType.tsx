import React from "react";
import { FileText, File, Video, Presentation } from "lucide-react";

type FileTypeProps = {
  fileType: string;
  rounded?: boolean;
};

const FileType: React.FC<FileTypeProps> = ({ fileType, rounded = true }) => {
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

  // Định nghĩa icon cho từng loại file
  const getFileTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case "PDF":
        return <FileText size={12} />;
      case "WORD":
        return <FileText size={12} />;
      case "EXCEL":
        return <FileText size={12} />;
      case "POWERPOINT":
        return <Presentation size={12} />;
      case "VIDEO":
        return <Video size={12} />;
      default:
        return <File size={12} />;
    }
  };

  return (
    <div
      className={`flex items-center justify-center shadow-sm ${getFileTypeColor(
        fileType
      )} ${
        rounded ? "rounded-full" : "rounded-r-full"
      } px-2 py-[1px] text-[10px] font-bold w-fit`}
    >
      {getFileTypeIcon(fileType)}
      <span className="ml-1 align-middle">{fileType}</span>
    </div>
  );
};

export default FileType;
