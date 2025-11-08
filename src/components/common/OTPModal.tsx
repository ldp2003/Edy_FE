import React, { useState, useEffect } from "react";
import { Modal, Input, Button, message, Form } from "antd";
import { verifyOTP, createOTP } from "../../utils/AuthService";

interface OTPModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  email: string;
  type: "REGISTER" | "RESET_PASSWORD" | "VERIFY_EMAIL";
  title?: string;
  description?: string;
  loadingRegistering?: boolean;
}

const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  email,
  type,
  title,
  description,
  loadingRegistering = false,
}) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  // Auto focus on OTP input when modal opens
  useEffect(() => {
    if (visible) {
      setOtp("");
      setCountdown(60); // 60 seconds countdown
    }
  }, [visible]);

  // Countdown timer
  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      messageApi.error("Vui lòng nhập mã OTP!");
      return;
    }

    if (otp.length !== 6) {
      messageApi.error("Mã OTP phải có 6 chữ số!");
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOTP(email, otp, type);
      if (result.message === "OTP hợp lệ") {
        messageApi.success("Xác thực OTP thành công!");
        onSuccess();
      } else {
        messageApi.error(result.error || "Mã OTP không hợp lệ!");
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.message || "Xác thực OTP thất bại!";
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const result = await createOTP(email, type);
      if (result.message === "OTP đã được gửi đến email của bạn") {
        messageApi.success("Đã gửi lại mã OTP!");
        setCountdown(60);
      } else {
        messageApi.error(result.error || "Gửi lại OTP thất bại!");
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.message || "Gửi lại OTP thất bại!";
      messageApi.error(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerifyOTP();
    }
  };

  const defaultTitle =
    type === "REGISTER"
      ? "Xác thực tài khoản"
      : type === "RESET_PASSWORD"
      ? "Đặt lại mật khẩu"
      : "Xác thực email";

  const defaultDescription = `Chúng tôi đã gửi mã OTP 6 chữ số đến email ${email}. Vui lòng nhập mã để tiếp tục.`;

  return (
    <>
      {contextHolder}
      <Modal
        title={title || defaultTitle}
        open={visible}
        onCancel={onCancel}
        footer={null}
        centered
        width={400}
        maskClosable={false}
      >
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            {description || defaultDescription}
          </p>
        </div>

        <Form layout="vertical">
          <Form.Item
            label="Mã OTP"
            rules={[
              { required: true, message: "Vui lòng nhập mã OTP!" },
              { pattern: /^\d{6}$/, message: "Mã OTP phải có 6 chữ số!" },
            ]}
          >
            <Input
              placeholder="Nhập mã OTP 6 chữ số"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
                if (value.length <= 6) {
                  setOtp(value);
                }
              }}
              onKeyPress={handleKeyPress}
              maxLength={6}
              disabled={loadingRegistering}
              className="text-center text-lg tracking-widest"
              style={{
                fontSize: "18px",
                letterSpacing: "0.5em",
                textAlign: "center",
              }}
            />
          </Form.Item>

          <div className="flex gap-3">
            <Button
              type="primary"
              onClick={handleVerifyOTP}
              loading={loading || loadingRegistering}
              disabled={loading || loadingRegistering}
              className="flex-1"
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
              }}
            >
              Xác thực
            </Button>

            <Button
              onClick={onCancel}
              className="flex-1"
              disabled={loadingRegistering}
            >
              Hủy
            </Button>
          </div>

          <div className="text-center mt-4">
            <Button
              type="link"
              onClick={handleResendOTP}
              loading={resendLoading}
              disabled={countdown > 0 || loadingRegistering}
              className="p-0 h-auto"
            >
              {countdown > 0
                ? `Gửi lại OTP sau ${countdown}s`
                : "Gửi lại mã OTP"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default OTPModal;
