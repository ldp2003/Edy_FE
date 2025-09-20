import React, { useState } from "react";
import { Menu, message, Modal } from "antd";
import { logout } from "../../../utils/AuthService";

const AdminDropdown: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case "dashboard":
        window.location.href = "/admin";
        break;
      case "documents":
        window.location.href = "/admin/documents";
        break;
      case "users":
        window.location.href = "/admin/users";
        break;
      case "subjects":
        window.location.href = "/admin/subjects";
        break;
      case "organizations":
        window.location.href = "/admin/organizations";
        break;
      case "switch-to-user":
        window.location.href = "/";
        break;
      case "logout":
        setLogoutModalVisible(true);
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Clear selected role when logout
      localStorage.removeItem("selectedRole");
      messageApi.success("Đăng xuất thành công");
      window.location.href = "/";
    } catch (error) {
      messageApi.error("Đăng xuất thất bại");
      console.error("Logout failed:", error);
    } finally {
      setLogoutModalVisible(false);
    }
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: "dashboard",
          label: "Trang quản trị",
          icon: <i className="icon-dashboard" />,
        },
        {
          key: "documents",
          label: "Quản lý tài liệu",
          icon: <i className="icon-document" />,
        },
        {
          key: "users",
          label: "Quản lý người dùng",
          icon: <i className="icon-users" />,
        },
        {
          key: "subjects",
          label: "Quản lý môn học",
          icon: <i className="icon-subjects" />,
        },
        {
          key: "organizations",
          label: "Quản lý tổ chức",
          icon: <i className="icon-organization" />,
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: "Đăng xuất",
          icon: <i className="icon-logout" />,
        },
      ]}
    />
  );

  return (
    <>
      {contextHolder}
      {menu}
      <Modal
        title="Xác nhận đăng xuất"
        open={isLogoutModalVisible}
        onOk={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
        okText="Đăng xuất"
        cancelText="Hủy"
      >
        Bạn có chắc chắn muốn đăng xuất không?
      </Modal>
    </>
  );
};

export default AdminDropdown;
