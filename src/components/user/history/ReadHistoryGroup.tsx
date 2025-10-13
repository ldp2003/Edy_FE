import React from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import ReadHistoryItem from "./ReadHistoryItem";
import type { ReadHistoryItem as ReadHistoryItemType } from "../../../contexts/UserContext";

interface ReadHistoryGroupProps {
  date: string;
  items: ReadHistoryItemType[];
  onItemClick: (documentId: string) => void;
}

const ReadHistoryGroup: React.FC<ReadHistoryGroupProps> = ({
  date,
  items,
  onItemClick,
}) => {
  const getDateLabel = (dateStr: string) => {
    const today = new Date();
    const targetDate = new Date(dateStr);
    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1 && today.getDate() === targetDate.getDate()) {
      return "Hôm nay";
    } else if (diffDays === 2 && today.getDate() - targetDate.getDate() === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return format(targetDate, "dd/MM/yyyy", { locale: vi });
    }
  };

  return (
    <div className="mb-6 text-left bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-[var(--primary-text-color)] border-b border-gray-200 pb-2">
          {getDateLabel(date)}
        </h3>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <ReadHistoryItem key={item._id} item={item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
};

export default ReadHistoryGroup;
