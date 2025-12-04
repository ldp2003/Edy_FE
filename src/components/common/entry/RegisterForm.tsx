import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { login, createOTP, register } from "../../../utils/AuthService";
import {
  validateEmail,
  validatePassword,
} from "../../../utils/ValidationUtils.ts";
import OTPModal from "../OTPModal";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [registrationData, setRegistrationData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  } | null>(null);
  const [loadingSendingOTP, setLoadingSendingOTP] = useState(false);
  const [loadingRegistering, setLoadingRegistering] = useState(false);

  const onFinish = async (values: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => {
    const { firstname, lastname, email, password } = values;

    // Lưu dữ liệu đăng ký để sử dụng sau khi xác thực OTP
    setRegistrationData({
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password,
    });

    // Gửi OTP trước
    setLoadingSendingOTP(true);
    try {
      const otpResult = await createOTP(email, "REGISTER");
      if (otpResult.message === "OTP đã được gửi đến email của bạn") {
        messageApi.success("Đã gửi mã OTP đến email của bạn!");
        setOtpModalVisible(true);
      } else {
        messageApi.error(otpResult.error || "Gửi OTP thất bại!");
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.message || "Gửi OTP thất bại!";
      messageApi.error(errorMessage);
    } finally {
      setLoadingSendingOTP(false);
    }
  };

  const handleOTPVerified = async () => {
    if (!registrationData) return;

    setLoadingRegistering(true);
    try {
      const result = await register(registrationData);

      if (result.message === "Đăng ký thành công") {
        messageApi.success("Đăng ký thành công!");
        setOtpModalVisible(false);
        form.resetFields();
        setRegistrationData(null);

        // Auto login sau khi đăng ký thành công
        try {
          const loginResponse = await login(
            registrationData.email,
            registrationData.password
          );
          if (loginResponse) {
            setTimeout(() => {
              window.location.reload();
            }, 500);
            onSuccess();
          }
        } catch (loginError) {
          console.error("Auto login failed:", loginError);
          // Vẫn coi là thành công, user có thể login thủ công
          onSuccess();
        }
      } else {
        messageApi.error(result.error || "Đăng ký thất bại!");
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.message || "Đăng ký thất bại!";
      messageApi.error(errorMessage);
    } finally {
      setLoadingRegistering(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[450px] flex items-center justify-center p-4">
      {contextHolder}
      <div className="bg-white w-full max-w-sm">
        <h2
          className="text-2xl mb-6 text-center font-bold"
          style={{ color: "var(--primary-text-color)" }}
        >
          Đăng Ký
        </h2>
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          className="w-full"
        >
          <Form.Item
            label="Họ"
            name="firstname"
            rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
          >
            <Input
              placeholder="Họ"
              style={{
                borderColor: "var(--primary-color)",
                borderRadius: "8px",
                padding: "12px",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Tên"
            name="lastname"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input
              placeholder="Tên"
              style={{
                borderColor: "var(--primary-color)",
                borderRadius: "8px",
                padding: "12px",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              {
                validator: (_, value) => {
                  const result = validateEmail(value);
                  return result.isValid
                    ? Promise.resolve()
                    : Promise.reject(new Error(result.message));
                },
              },
            ]}
          >
            <Input
              placeholder="Email"
              style={{
                borderColor: "var(--primary-color)",
                borderRadius: "8px",
                padding: "12px",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                validator: (_, value) => {
                  const result = validatePassword(value);
                  return result.isValid
                    ? Promise.resolve()
                    : Promise.reject(new Error(result.message));
                },
              },
            ]}
          >
            <Input.Password
              placeholder="Mật khẩu"
              style={{
                borderColor: "var(--primary-color)",
                borderRadius: "8px",
                padding: "12px",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Xác nhận mật khẩu"
              style={{
                borderColor: "var(--primary-color)",
                borderRadius: "8px",
                padding: "12px",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={loadingSendingOTP}
              disabled={loadingSendingOTP}
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
                height: "48px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Đăng Ký
            </Button>
          </Form.Item>
        </Form>
        <p
          className="mt-4 text-center"
          style={{ color: "var(--primary-text-color)" }}
        >
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="bg-transparent border-none p-0 cursor-pointer font-medium"
            style={{
              color: "var(--primary-color)",
              textDecoration: "underline",
            }}
          >
            Đăng Nhập
          </button>
        </p>
      </div>

      <OTPModal
        visible={otpModalVisible}
        onCancel={() => setOtpModalVisible(false)}
        onSuccess={handleOTPVerified}
        email={registrationData?.email || ""}
        type="REGISTER"
        loadingRegistering={loadingRegistering}
      />
    </div>
  );
};

export default RegisterForm;
