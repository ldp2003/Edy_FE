import React, { useEffect } from "react";
import { Result, Button } from "antd";
import { logout } from "../../utils/AuthService";

const BannedUserPage: React.FC = () => {
  const handleLogout = async () => {
    try {
      await logout();
      // Force page reload to clear all state
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
      // Force logout anyway
      window.location.href = "/";
    }
  };

  // Auto logout on any user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      // console.log("🚫 Banned user interaction detected, auto-logout initiated");
      handleLogout();
    };

    // Add event listeners for various user interactions
    const events = ["click", "keydown", "scroll", "mousemove", "touchstart"];

    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    // Cleanup function
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--primary-background-color)" }}
    >
      <div className="max-w-md w-full mx-4">
        <Result
          status="error"
          title={
            <span
              style={{ color: "var(--primary-text-color)" }}
              className="text-xl font-bold"
            >
              Tài khoản đã bị khóa
            </span>
          }
          subTitle={
            <span
              style={{ color: "var(--secondary-text-color)" }}
              className="text-sm"
            >
              Tài khoản của bạn đã bị khóa do vi phạm quy định của hệ thống. Nếu
              bạn cho rằng đây là lỗi, vui lòng liên hệ với quản trị viên.
            </span>
          }
          extra={
            <Button
              type="primary"
              danger
              size="large"
              onClick={handleLogout}
              style={{
                backgroundColor: "var(--red-button-color)",
                borderColor: "var(--red-button-color)",
              }}
            >
              Đăng xuất
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default BannedUserPage;
