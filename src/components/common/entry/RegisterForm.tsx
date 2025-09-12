import React from "react";
import { Form, Input, Button } from "antd";
import type { Store } from "antd/es/form/interface";
import type { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { register } from "../../../utils/AuthService";

const RegisterForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const onFinish = async (values: Store) => {
    try {
      const { firstname, lastname, email, password } = values;
      const response = await register(firstname, lastname, email, password);
      console.log("Registration successful:", response);
      onSuccess(); // Call the success handler
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="bg-white p-6 w-full text-center">
      <h2 className="text-2xl mb-4">Đăng Ký</h2>
      <Form
        name="register"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Họ"
          name="firstname"
          rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
        >
          <Input placeholder="Họ" />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="lastname"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="Tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
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
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Đăng Ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterForm;
