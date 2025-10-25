import React from "react";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";

interface LoginRequiredModalProps {
  visible: boolean;
  onCancel: () => void;
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  visible,
  onCancel,
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Chuyển đến trang đăng nhập (có thể là trang chủ hoặc trang login riêng)
    navigate("/");
  };

  const handleCancel = () => {
    onCancel();
    // Về trang chủ
    navigate("/");
  };

  return (
    <Modal
      title="Thông báo"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="login" type="primary" onClick={handleLogin}>
          Đăng nhập
        </Button>,
      ]}
      centered
      maskClosable={false}
      closable={false}
    >
      <p>Bạn cần đăng nhập để truy cập trang này.</p>
    </Modal>
  );
};

export default LoginRequiredModal;
