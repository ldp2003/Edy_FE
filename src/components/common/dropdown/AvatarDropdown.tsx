import React, { useState } from "react";
import { Menu, Modal, message } from "antd";
import LoginForm from "../entry/LoginForm";
import RegisterForm from "../entry/RegisterForm";

const AvatarDropdown: React.FC = () => {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "login") {
      setLoginModalVisible(true);
    } else if (e.key === "register") {
      setRegisterModalVisible(true);
    }
  };

  const handleRegisterSuccess = () => {
    messageApi.success("Đăng ký thành công");
    setRegisterModalVisible(false);
  };

  const handleLoginSuccess = () => {
    messageApi.success("Đăng nhập thành công");
    setLoginModalVisible(false);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="login">Đăng nhập</Menu.Item>
      <Menu.Item key="register">Đăng ký</Menu.Item>
    </Menu>
  );

  return (
    <>
      {menu}
      {contextHolder}
      <Modal
        open={isLoginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={null}
      >
        <LoginForm onSuccess={handleLoginSuccess} />
      </Modal>

      <Modal
        open={isRegisterModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={null}
      >
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </Modal>
    </>
  );
};

export default AvatarDropdown;
