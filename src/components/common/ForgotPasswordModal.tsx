import React, { useState } from "react";
import { Modal, Input, Button, message, Form } from "antd";
import { createOTP } from "../../utils/AuthService";

interface ForgotPasswordModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (email: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSendOTP = async () => {
    if (!email.trim()) {
      messageApi.error("Vui lòng nhập email!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      messageApi.error("Email không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      const result = await createOTP(email, "RESET_PASSWORD");
      if (result.message === "OTP đã được gửi đến email của bạn") {
        messageApi.success("Đã gửi mã OTP đến email của bạn!");
        onSuccess(email);
      } else {
        messageApi.error(result.error || "Gửi OTP thất bại!");
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.message || "Gửi OTP thất bại!";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendOTP();
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Quên mật khẩu"
        open={visible}
        onCancel={onCancel}
        footer={null}
        centered
        width={400}
        maskClosable={false}
      >
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.
          </p>
        </div>

        <Form layout="vertical">
          <Form.Item
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </Form.Item>

          <div className="flex gap-3">
            <Button
              type="primary"
              onClick={handleSendOTP}
              loading={loading}
              className="flex-1"
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
              }}
            >
              Gửi OTP
            </Button>

            <Button onClick={onCancel} className="flex-1">
              Hủy
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
