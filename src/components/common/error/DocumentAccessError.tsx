import React from "react";
import { Button } from "antd";
import { HomeOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface DocumentAccessErrorProps {
  message?: string;
  type?: "private" | "restricted" | "not-found" | "unauthorized";
}

const DocumentAccessError: React.FC<DocumentAccessErrorProps> = ({
  message,
  type = "unauthorized",
}) => {
  const navigate = useNavigate();

  const getErrorContent = () => {
    switch (type) {
      case "private":
        return {
          icon: <LockOutlined className="text-6xl text-red-400 mb-4" />,
          title: "Tài liệu riêng tư",
          description:
            "Tài liệu này được đặt ở chế độ riêng tư và không thể truy cập công khai.",
        };
      case "restricted":
        return {
          icon: <LockOutlined className="text-6xl text-orange-400 mb-4" />,
          title: "Truy cập bị hạn chế",
          description:
            "Bạn không có quyền truy cập vào tài liệu này. Vui lòng liên hệ với tác giả để được cấp quyền.",
        };
      case "not-found":
        return {
          icon: <div className="text-6xl text-gray-400 mb-4">📄</div>,
          title: "Không tìm thấy tài liệu",
          description:
            "Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.",
        };
      default:
        return {
          icon: <LockOutlined className="text-6xl text-red-400 mb-4" />,
          title: "Không thể truy cập",
          description:
            message || "Bạn không có quyền truy cập vào tài liệu này.",
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {icon}

          <h1 className="text-2xl font-bold text-gray-800 mb-4">{title}</h1>

          <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate("/")}
              className="flex items-center justify-center"
            >
              Về trang chủ
            </Button>

            <Button
              size="large"
              onClick={() => navigate(-1)}
              className="flex items-center justify-center"
            >
              Quay lại
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Nếu bạn cho rằng đây là lỗi, vui lòng{" "}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => {
                  // TODO: Implement contact support
                  console.log("Contact support");
                }}
              >
                liên hệ hỗ trợ
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAccessError;
