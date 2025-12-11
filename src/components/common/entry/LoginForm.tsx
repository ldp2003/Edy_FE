import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { login, forgotPassword } from "../../../utils/AuthService";
import ForgotPasswordModal from "../ForgotPasswordModal";
import OTPModal from "../OTPModal";

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const handleForgotPassword = () => {
    setForgotPasswordVisible(true);
  };

  const handleForgotPasswordSuccess = (email: string) => {
    setResetEmail(email);
    setForgotPasswordVisible(false);
    setOtpVisible(true);
  };

  const handleOtpSuccess = async () => {
    try {
      await forgotPassword(resetEmail);
      messageApi.success("Mật khẩu mới đã được gửi về email của bạn!");
      setOtpVisible(false);
    } catch (error) {
      console.error("Gửi mật khẩu mới thất bại:", error);
      messageApi.error("Gửi mật khẩu mới thất bại!");
    }
  };

  const handleCancelForgotPassword = () => {
    setForgotPasswordVisible(false);
  };

  const handleCancelOtp = () => {
    setOtpVisible(false);
  };

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const result = await login(email, password);
      if (result) {
        messageApi.success("Đăng nhập thành công");
        form.resetFields();
        // console.log("Login successful:", result);

        // Trigger AuthRoute recheck sau khi login thành công
        // Có thể dùng window.location.reload() hoặc navigate
        setTimeout(() => {
          window.location.reload();
        }, 500); // Delay nhỏ để user thấy success message

        onSuccess();
      }
    } catch (error: unknown) {
      let errorMessage = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response: { data: { message: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error && typeof error === "object" && "message" in error) {
        const basicError = error as { message: string };
        errorMessage = basicError.message;
      }

      messageApi.error(errorMessage);
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center p-4">
      {contextHolder}
      <div className="bg-white w-full max-w-sm">
        <h2
          className="text-2xl mb-6 text-center font-bold"
          style={{ color: "var(--primary-text-color)" }}
        >
          Đăng Nhập
        </h2>
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loading}
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
                height: "48px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>
        <p
          className="mt-4 text-center"
          style={{ color: "var(--primary-text-color)" }}
        >
          <button
            type="button"
            onClick={handleForgotPassword}
            className="bg-transparent border-none p-0 cursor-pointer font-medium mr-4"
            style={{
              color: "var(--primary-color)",
              textDecoration: "underline",
            }}
          >
            Quên mật khẩu?
          </button>
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="bg-transparent border-none p-0 cursor-pointer font-medium"
            style={{
              color: "var(--primary-color)",
              textDecoration: "underline",
            }}
          >
            Đăng Ký
          </button>
        </p>
      </div>

      <ForgotPasswordModal
        visible={forgotPasswordVisible}
        onCancel={handleCancelForgotPassword}
        onSuccess={handleForgotPasswordSuccess}
      />

      <OTPModal
        visible={otpVisible}
        onCancel={handleCancelOtp}
        onSuccess={handleOtpSuccess}
        email={resetEmail}
        type="RESET_PASSWORD"
        title="Đặt lại mật khẩu"
        description={`Chúng tôi đã gửi mã OTP 6 chữ số đến email ${resetEmail}. Vui lòng nhập mã để đặt lại mật khẩu.`}
      />
    </div>
  );
};

export default LoginForm;
