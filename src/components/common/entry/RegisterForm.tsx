import React from "react";
import { Form, Input, Button, message } from "antd";
import type { Store } from "antd/es/form/interface";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { register, login } from "../../../utils/AuthService";

interface RegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = async (values: Store) => {
    try {
      const { firstname, lastname, email, password } = values;
      const response = await register(firstname, lastname, email, password);
      console.log("Registration successful:", response);

      const loginResponse = await login(email, password);
      if (loginResponse) {
        messageApi.success("Đăng ký thành công!");
        onSuccess();
        window.location.reload();
      }
    } catch (error) {
      messageApi.error("Đăng ký thất bại. Vui lòng thử lại.");
      console.error("Registration failed:", error);
    }
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
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
          onFinishFailed={onFinishFailed}
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
              { type: "email", message: "Email không hợp lệ!" },
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
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
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
    </div>
  );
};

export default RegisterForm;
