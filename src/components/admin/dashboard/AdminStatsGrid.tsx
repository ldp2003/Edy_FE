import React from "react";
import { Row, Col } from "antd";
import AdminStatsCard, { type StatCard } from "./AdminStatsCard";

interface AdminStatsGridProps {
  statsData: StatCard[];
}

const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({ statsData }) => {
  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 24px 32px 24px",
      }}
    >
      <Row gutter={[24, 24]}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <AdminStatsCard stat={stat} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminStatsGrid;
