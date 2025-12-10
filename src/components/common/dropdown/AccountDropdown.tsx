import React, { useState } from "react";
import { Menu, message, Modal } from "antd";
import { logout } from "../../../utils/AuthService";
import { LogOut } from "lucide-react";

const AccountDropdown: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === "logout") {
      setLogoutModalVisible(true);
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
      messageApi.error("Đăng xuất thất bại, vui lòng thử tải lại trang.");
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

export default AccountDropdown;
