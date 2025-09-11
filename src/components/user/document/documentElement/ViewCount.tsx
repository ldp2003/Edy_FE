import React from "react";
import { Eye } from "lucide-react";

type ViewCountProps = {
  count: number;
};

const ViewCount: React.FC<ViewCountProps> = ({ count }) => {
  return (
    <div className="flex items-center border rounded-full px-2 py-[1px] font-bold text-xs w-fit">
      <Eye className="mr-2 color-black" size={16} />
      <span>{count} lượt xem</span>
    </div>
  );
};

export default ViewCount;
