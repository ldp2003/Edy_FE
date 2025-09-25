import React, { useState, useEffect } from "react";
import { Table, Tag, Button, message } from "antd";
import { Eye } from "lucide-react";

interface Violation {
  id: string;
  type: string;
  description: string;
  date: string;
  status: string;
}

interface UserViolationHistoryProps {
  userId: string;
}

const UserViolationHistory: React.FC<UserViolationHistoryProps> = ({
  userId,
}) => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        setLoading(true);

        const mockViolations: Violation[] = [
          {
            id: "1",
            type: "Sinh hiện không phù hợp",
            description: "Tải lên tài liệu vi phạm bản quyền",
            date: "30/10/2024",
            status: "Đã xử lý",
          },
          {
            id: "2",
            type: "Sinh hiện không phù hợp",
            description: "Bình luận không phù hợp",
            date: "30/10/2024",
            status: "Đã xử lý",
          },
          {
            id: "3",
            type: "Avatar không phù hợp",
            description: "Sử dụng avatar không phù hợp với cộng đồng",
            date: "30/10/2024",
            status: "Đang xử lý",
          },
          {
            id: "4",
            type: "Tên của tài khoản không phù hợp",
            description: "Tên tài khoản chứa từ ngữ không phù hợp",
            date: "16/10/2024",
            status: "Đã xử lý",
          },
          {
            id: "5",
            type: "Sinh hiện công khiển khoác khác",
            description: "Vi phạm quy định về tương tác trong cộng đồng",
            date: "16/10/2024",
            status: "Đã xử lý",
          },
        ];

        setViolations(mockViolations);
      } catch (error) {
        console.error("Error fetching violations:", error);
        message.error("Không thể tải lịch sử vi phạm!");
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã xử lý":
        return "green";
      case "Đang xử lý":
        return "orange";
      case "Chưa xử lý":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Tên sự vi phạm",
      dataIndex: "type",
      key: "type",
      width: "25%",
      render: (text: string) => (
        <span className="font-medium text-sm">{text}</span>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="text-xs">
          {status}
        </Tag>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
      width: "15%",
      render: (date: string) => (
        <span className="text-sm text-gray-600">{date}</span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      render: (_: unknown, record: Violation) => (
        <Button
          type="link"
          icon={<Eye size={14} />}
          size="small"
          onClick={() => handleViewDetail(record)}
          className="text-blue-500 p-0"
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  const handleViewDetail = (violation: Violation) => {
    message.info(`Xem chi tiết vi phạm: ${violation.type}`);
    // Implement detail view logic
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-sm">Lịch sử vi phạm</h3>
        <Button type="link" className="text-blue-500 text-sm p-0">
          Xem thêm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={violations}
        loading={loading}
        pagination={false}
        size="small"
        className="text-sm"
        rowKey="id"
        locale={{
          emptyText: "Không có vi phạm nào",
        }}
      />

      {violations.length > 0 && (
        <div className="text-xs text-gray-500 text-right mt-2">
          Tổng cộng: {violations.length} vi phạm
        </div>
      )}
    </div>
  );
};

export default UserViolationHistory;
