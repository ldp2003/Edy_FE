import React from "react";
import { Row, Col, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

interface QuickAction {
  title: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

interface AdminQuickActionsProps {
  quickActions: QuickAction[];
  showQuickActions: boolean;
  setShowQuickActions: (show: boolean) => void;
}

const AdminQuickActions: React.FC<AdminQuickActionsProps> = ({
  quickActions,
  showQuickActions,
  setShowQuickActions,
}) => {
  const navigate = useNavigate();

  return (
    <Row gutter={[24, 24]} className="mt-6">
      <Col xs={24}>
        <div
          className="h-full p-4 rounded-lg shadow-md"
          style={{
            backgroundColor: "var(--primary-background-color)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-base font-bold w-fit text-left"
              style={{ color: "var(--primary-text-color)" }}
            >
              Thao tác
            </h2>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              title={
                showQuickActions
                  ? "Ẩn chuyển hướng nhanh"
                  : "Hiện chuyển hướng nhanh"
              }
            >
              {showQuickActions ? (
                <EyeOff
                  className="w-4 h-4"
                  style={{ color: "var(--secondary-text-color)" }}
                />
              ) : (
                <Eye
                  className="w-4 h-4"
                  style={{ color: "var(--secondary-text-color)" }}
                />
              )}
            </button>
          </div>
          {showQuickActions && (
            <div className="grid grid-cols-6 gap-2">
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  className="shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--primary-background-color)",
                    minHeight: "60px",
                  }}
                  bodyStyle={{ padding: "6px 4px" }}
                  onClick={() => navigate(action.path)}
                >
                  <div className="flex flex-col items-center text-center gap-0.5">
                    <div className="flex-shrink-0 scale-75">{action.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-xs sm:text-sm font-semibold mb-0 leading-tight"
                        style={{ color: "var(--primary-text-color)" }}
                      >
                        {action.title}
                      </h3>
                      <p
                        className="text-[10px] sm:text-xs leading-tight mt-0.5 hidden xl:block"
                        style={{ color: "var(--secondary-text-color)" }}
                      >
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default AdminQuickActions;
