import React, { useState } from "react";
import { Menu, message, Modal } from "antd";
import { logout } from "../../../utils/AuthService";
import {
  FileText,
  Users,
  Book,
  Building,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

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
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Trang quản trị</span>
              <LayoutDashboard size={16} />
            </div>
          ),
        },
        {
          key: "documents",
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Quản lý tài liệu</span>
              <FileText size={16} />
            </div>
          ),
        },
        {
          key: "users",
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Quản lý người dùng</span>
              <Users size={16} />
            </div>
          ),
        },
        {
          key: "subjects",
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Quản lý môn học</span>
              <Book size={16} />
            </div>
          ),
        },
        {
          key: "organizations",
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Quản lý tổ chức</span>
              <Building size={16} />
            </div>
          ),
        },
        {
          type: "divider",
        },
        {
          key: "logout",
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Đăng xuất</span>
              <LogOut size={16} />
            </div>
          ),
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
