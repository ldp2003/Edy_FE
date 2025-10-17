import React from "react";
import { useNavigate } from "react-router-dom";

interface DocumentAccessDeniedPageProps {
  message?: string;
  showReturnButton?: boolean;
}

const DocumentAccessDeniedPage: React.FC<DocumentAccessDeniedPageProps> = ({
  message,
  showReturnButton = true,
}) => {
  const navigate = useNavigate();

  const getErrorContent = () => {
    // Đơn giản hóa thành thông báo chung
    return {
      icon: "🚫",
      title: "Tài liệu không khả dụng",
      description: message || "Tài liệu này hiện không thể truy cập được.",
      actionText: "Quay lại trang chủ",
    };
  };

  const { title, description, actionText } = getErrorContent();

  const handleAction = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
        <h1 className="text-2xl font-bold text-[var(--primary-text-color)] mb-2">
          {title}
        </h1>
        <p className="text-gray-600 mb-6">{description}</p>

        {showReturnButton && (
          <div className="space-y-3">
            <button
              onClick={handleAction}
              className="cursor-pointer w-full bg-[var(--primary-color)] hover:bg-blue-600 text-white px-6 py-3 rounded-md transition-colors font-medium"
            >
              {actionText}
            </button>

            <button
              onClick={() => window.history.back()}
              className="cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md transition-colors font-medium"
            >
              Quay lại trang trước
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAccessDeniedPage;
