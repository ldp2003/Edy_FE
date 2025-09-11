import React from "react";
import { File } from "lucide-react";

type PageCountProps = {
  pages: number;
};

const PageCount: React.FC<PageCountProps> = ({ pages }) => {
  return (
    <div
      className="flex items-center bg-gray-200 rounded-full px-4 py-[1px] text-xs font-bold w-fit"
      style={{ color: "var(--page-element-color)" }}
    >
      <File className="mr-2" size={16} />
      <span>{pages} trang</span>
    </div>
  );
};

export default PageCount;
