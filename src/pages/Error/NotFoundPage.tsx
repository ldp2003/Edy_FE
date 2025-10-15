import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
        extra={
          <div className="space-x-2">
            <Button
              type="primary"
              icon={<Home size={16} />}
              onClick={() => navigate("/")}
            >
              Về trang chủ
            </Button>
            <Button icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default NotFoundPage;
