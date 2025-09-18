import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { login } from "../../../utils/AuthService";

const LoginForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const { email, password } = values;
      const result = await login(email, password);
      if (result) {
        messageApi.success("Đăng nhập thành công");
        form.resetFields(); // Clear form data
        onSuccess(); // Call the success handler
        window.location.reload(); // Reload the page
      }
    } catch (error: unknown) {
      // Extract error message from API response
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
    <div className="bg-white p-6 w-full text-center">
      {contextHolder}
      <h2 className="text-2xl mb-4">Đăng Nhập</h2>
      <Form form={form} name="login" layout="vertical" onFinish={onFinish}>
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
          >
            Đăng Nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
