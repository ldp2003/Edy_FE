import React, { useState, useContext, useMemo } from "react";
import { Input, Empty } from "antd";
import { format, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  UserContext,
  type ReadHistoryItem,
} from "../../../contexts/UserContext";
import ReadHistoryGroup from "./ReadHistoryGroup";

const { Search } = Input;

const ReadHistoryTable: React.FC = () => {
  const navigate = useNavigate();
  const { readHistory } = useContext(UserContext);
  const [searchText, setSearchText] = useState("");

  const filteredHistory = readHistory.filter((item: ReadHistoryItem) =>
    item.document.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDocumentClick = (documentId: string) => {
    navigate(`/document-detail/${documentId}`);
  };

  // Group history by date
  const groupedHistory = useMemo(() => {
    const groups: { [key: string]: ReadHistoryItem[] } = {};

    filteredHistory.forEach((item) => {
      const date = format(startOfDay(new Date(item.read_at)), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });

    // Sort dates in descending order
    const sortedDates = Object.keys(groups).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedDates.map((date) => ({
      date,
      items: groups[date].sort(
        (a, b) => new Date(b.read_at).getTime() - new Date(a.read_at).getTime()
      ),
    }));
  }, [filteredHistory]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-base font-bold text-[var(--primary-text-color)]">
          Lịch sử xem
        </h1>
        <Search
          placeholder="Tìm kiếm theo tiêu đề"
          allowClear
          className="max-w-md"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>

      {groupedHistory.length === 0 ? (
        <Empty
          description="Chưa có lịch sử xem tài liệu nào"
          className="py-8"
        />
      ) : (
        <div className="space-y-4">
          {groupedHistory.map((group) => (
            <ReadHistoryGroup
              key={group.date}
              date={group.date}
              items={group.items}
              onItemClick={handleDocumentClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadHistoryTable;
