import React, { useState } from "react";
import { Menu, Modal } from "antd";
import LoginForm from "../entry/LoginForm";
import RegisterForm from "../entry/RegisterForm";

const AvatarDropdown: React.FC = () => {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "login") {
      setLoginModalVisible(true);
    } else if (e.key === "register") {
      setRegisterModalVisible(true);
    }
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

      <Modal
        open={isLoginModalVisible}
        onCancel={() => setLoginModalVisible(false)}
        footer={null}
      >
        <LoginForm />
      </Modal>

      <Modal
        open={isRegisterModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={null}
      >
        <RegisterForm />
      </Modal>
    </>
  );
};

export default AvatarDropdown;
