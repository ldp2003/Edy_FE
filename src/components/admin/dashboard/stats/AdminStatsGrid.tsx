import React from "react";
import { Row, Col, Card, Spin } from "antd";

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

interface AdminStatsGridProps {
  statsCards: StatCard[];
  loading: boolean;
}

const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({
  statsCards,
  loading,
}) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <div
          className="p-4 rounded-lg shadow-md"
          style={{
            backgroundColor: "var(--primary-background-color)",
          }}
        >
          <Row gutter={[12, 12]}>
            {statsCards.map((stat, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card
                  className=" transition-shadow duration-200 border-lg"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--secondary-background-color)",
                    minHeight: "100px",
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center h-12">
                      <Spin size="small" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div
                          className="text-xs xs:text-xs sm:text-sm font-medium mb-1"
                          style={{ color: "var(--secondary-text-color)" }}
                        >
                          {stat.title}
                        </div>
                        <div
                          className="text-base xs:text-base sm:text-base md:text-base font-bold"
                          style={{ color: stat.color }}
                        >
                          {stat.value}
                        </div>
                      </div>
                      <div
                        className="p-1.5 rounded-lg"
                        style={{
                          backgroundColor: "var(--field-background-color)",
                        }}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default AdminStatsGrid;
