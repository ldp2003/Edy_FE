import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Transaction {
  _id: string;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  type: "EARN" | "SPEND";
  point: number;
  reason: string;
  createdAt: string;
}

interface PointHistoryProps {
  transactions: Transaction[];
  loading?: boolean;
  onViewMore?: () => void;
}

const PointHistory: React.FC<PointHistoryProps> = ({
  transactions,
  loading = false,
  onViewMore,
}) => {
  const columns: ColumnsType<Transaction> = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      width: 120,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "EARN" ? "green" : "red"}>
          {type === "EARN" ? "Tích điểm" : "Tiêu điểm"}
        </Tag>
      ),
      width: 100,
    },
    {
      title: "Điểm",
      dataIndex: "point",
      key: "point",
      render: (point: number, record) => (
        <span
          className={`font-semibold ${
            record.type === "EARN" ? "text-green-600" : "text-red-600"
          }`}
        >
          {record.type === "EARN" ? "+" : "-"}
          {point}
        </span>
      ),
      width: 80,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      ellipsis: true,
    },
  ];

  return (
    <div className="p-4 bg-white w-full rounded-md text-left shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-[var(--primary-text-color)]">
          Lịch sử tích tiêu điểm
        </h3>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="text-xs text-[var(--link-color)] hover:underline"
          >
            Xem thêm &gt;
          </button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={transactions}
        loading={loading}
        pagination={false}
        size="small"
        rowKey="_id"
        className="text-xs"
        locale={{
          emptyText: "Chưa có lịch sử giao dịch điểm nào.",
        }}
      />
    </div>
  );
};

export default PointHistory;
