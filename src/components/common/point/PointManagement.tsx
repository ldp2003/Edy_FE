import React, { useState } from "react";
import { Tabs } from "antd";
import PointHistory from "./PointHistory";
import PointMechanism from "./PointMechanism";

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

interface PointManagementProps {
  transactions: Transaction[];
  loading?: boolean;
  onViewMoreHistory?: () => void;
  onViewMoreMechanism?: () => void;
}

const PointManagement: React.FC<PointManagementProps> = ({
  transactions,
  loading = false,
  onViewMoreHistory,
  onViewMoreMechanism,
}) => {
  const [activeTab, setActiveTab] = useState("history");

  const tabItems = [
    {
      key: "history",
      label: "Lịch sử",
      children: (
        <PointHistory
          transactions={transactions}
          loading={loading}
          onViewMore={onViewMoreHistory}
        />
      ),
    },
    {
      key: "mechanism",
      label: "Cơ chế",
      children: <PointMechanism onViewMore={onViewMoreMechanism} />,
    },
  ];

  return (
    <div className="w-full">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="point-management-tabs"
      />
    </div>
  );
};

export default PointManagement;
