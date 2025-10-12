import React, { useState, useEffect } from "react";
import { Table, Input, Avatar, Tag, Card, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserService } from "../../../utils/UserService";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

interface ReadHistoryItem {
  document: {
    _id: string;
    title: string;
    cover_page: string;
    status: string;
    public_mode: string;
    organization: string;
  };
  read_at: string;
  _id: string;
}

const ReadHistoryTable: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ReadHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await UserService.getReadHistory();
      setHistory(response);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) =>
    item.document.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDocumentClick = (documentId: string) => {
    navigate(`/document-detail/${documentId}`);
  };

  const columns: ColumnsType<ReadHistoryItem> = [
    {
      title: "Tài liệu",
      key: "document",
      render: (_, record) => (
        <Space 
          className="cursor-pointer" 
          onClick={() => handleDocumentClick(record.document._id)}
        >
          <Avatar
            shape="square"
            size={64}
            src={record.document.cover_page}
          />
          <div>
            <div className="font-medium hover:text-blue-600">
              {record.document.title}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Thời gian xem",
      key: "read_at",
      width: 200,
      render: (_, record) => (
        <span>
          {formatDistanceToNow(new Date(record.read_at), {
            addSuffix: true,
            locale: vi,
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lịch sử xem</h1>
        <Search
          placeholder="Tìm kiếm theo tiêu đề"
          allowClear
          className="max-w-md"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredHistory}
          rowKey={(record) => record._id}
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default ReadHistoryTable;