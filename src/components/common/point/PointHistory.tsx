import React, { useState, useMemo } from "react";
import { Table, Tag, Select } from "antd";
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
  pointType?: "RANKPOINT" | "USAGE" | "BOTH"; // Thêm loại điểm
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
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<
    string | undefined
  >();
  const [pointTypeFilter, setPointTypeFilter] = useState<string | undefined>();

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (transactionTypeFilter && transaction.type !== transactionTypeFilter)
        return false;
      if (pointTypeFilter && transaction.pointType !== pointTypeFilter)
        return false;
      return true;
    });
  }, [transactions, transactionTypeFilter, pointTypeFilter]);
  const columns: ColumnsType<Transaction> = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
      width: 120,
    },
    {
      title: "Loại giao dịch",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <Tag color={type === "EARN" ? "green" : "red"}>
          {type === "EARN" ? "Tích điểm" : "Tiêu điểm"}
        </Tag>
      ),
      width: 110,
      align: "center",
    },
    {
      title: "Loại điểm",
      dataIndex: "pointType",
      key: "pointType",
      align: "center",
      render: (pointType: string) => (
        <Tag color={pointType === "RANKPOINT" ? "blue" : "orange"}>
          {pointType === "RANKPOINT"
            ? "Điểm hạng"
            : pointType === "USAGE"
            ? "Điểm dùng"
            : pointType === "BOTH"
            ? "Cả hai"
            : "Không xác định"}
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
          className={` font-semibold ${
            record.type === "EARN" ? "text-green-600" : "text-red-600"
          }`}
        >
          {record.type === "EARN" ? "+" : "-"}
          {point}
        </span>
      ),
      width: 80,
      // căn giữa
      align: "center",
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
            className="text-xs text-[var(--link-color)] hover:underline cursor-pointer"
          >
            Xem thêm &gt;
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <label className="text-xs font-medium text-gray-600 block mb-1">
            Loại giao dịch:
          </label>
          <Select
            placeholder="Tất cả"
            allowClear
            value={transactionTypeFilter}
            onChange={setTransactionTypeFilter}
            className="w-full sm:w-32"
            size="small"
          >
            <Select.Option value="EARN">Tích điểm</Select.Option>
            <Select.Option value="SPEND">Tiêu điểm</Select.Option>
          </Select>
        </div>
        <div className="w-full sm:w-auto">
          <label className="text-xs font-medium text-gray-600 block mb-1">
            Loại điểm:
          </label>
          <Select
            placeholder="Tất cả"
            allowClear
            value={pointTypeFilter}
            onChange={setPointTypeFilter}
            className="w-full sm:w-32"
            size="small"
          >
            <Select.Option value="RANKPOINT">Điểm hạng</Select.Option>
            <Select.Option value="USAGE">Điểm dùng</Select.Option>
            <Select.Option value="BOTH">Cả hai</Select.Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTransactions}
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
