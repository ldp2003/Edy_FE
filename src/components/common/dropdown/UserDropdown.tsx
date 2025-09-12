import React, { useState } from "react";
import { Menu, message, Modal } from "antd";
import { logout } from "../../../utils/AuthService";

const UserDropdown: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case "profile":
        window.location.href = "/profile";
        break;
      case "upload":
        window.location.href = "/upload";
        break;
      case "edit":
        window.location.href = "/edit-info";
        break;
      case "history":
        window.location.href = "/point-history";
        break;
      case "stats":
        window.location.href = "/stats";
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
          key: "profile",
          label: "Trang cá nhân",
          icon: <i className="icon-user" />,
        },
        {
          key: "upload",
          label: "Đăng tải",
          icon: <i className="icon-upload" />,
        },
        {
          key: "edit",
          label: "Chỉnh sửa thông tin",
          icon: <i className="icon-edit" />,
        },
        {
          key: "history",
          label: "Lịch sử tích điểm",
          icon: <i className="icon-history" />,
        },
        { key: "stats", label: "Thống kê", icon: <i className="icon-stats" /> },
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
        visible={isLogoutModalVisible}
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

export default UserDropdown;
