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

  const switchToRegister = () => {
    setLoginModalVisible(false);
    setRegisterModalVisible(true);
  };

  const switchToLogin = () => {
    setRegisterModalVisible(false);
    setLoginModalVisible(true);
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
        width={450}
        centered
        styles={{
          body: { padding: 0, overflow: "hidden" },
          content: { padding: 0 },
        }}
        destroyOnClose
      >
        <LoginForm
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
        />
      </Modal>

      <Modal
        open={isRegisterModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={null}
        width={450}
        centered
        styles={{
          body: { padding: 0, overflow: "hidden" },
          content: { padding: 0 },
        }}
        destroyOnClose
      >
        <RegisterForm
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={switchToLogin}
        />
      </Modal>
    </>
  );
};

export default AvatarDropdown;
