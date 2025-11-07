import React from "react";
import { useNavigate } from "react-router-dom";

interface LimitNotificationModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
  title?: string;
  icon?: string;
}

const LimitNotificationModal: React.FC<LimitNotificationModalProps> = ({
  visible,
  onClose,
  message,
  title = "Đã xem hết giới hạn xem trước",
  icon = "📖",
}) => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    onClose();
    navigate("/auth/register");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div
        className="border rounded-lg shadow-lg p-6 max-w-md mx-4 w-full"
        style={{
          backgroundColor: "var(--primary-background-color)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="text-center space-y-4">
          <div className="text-4xl">{icon}</div>
          <h3
            className="text-lg sm:text-xl font-semibold"
            style={{ color: "var(--primary-text-color)" }}
          >
            {title}
          </h3>
          <p
            className="text-sm sm:text-base"
            style={{ color: "var(--secondary-text-color)" }}
          >
            {message}
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 border rounded hover:bg-gray-50"
              style={{
                borderColor: "var(--border-color)",
                color: "var(--secondary-text-color)",
              }}
            >
              Để sau
            </button>
            <button
              onClick={handleRegisterClick}
              className="px-6 py-2 text-white rounded hover:opacity-90"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LimitNotificationModal;
