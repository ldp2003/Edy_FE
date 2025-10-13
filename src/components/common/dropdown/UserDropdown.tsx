import React, { useState, useContext } from "react";
import { Menu, message, Modal } from "antd";
import { logout } from "../../../utils/AuthService";
import { UserContext } from "../../../contexts/UserContext";
import {
  User,
  Upload,
  Edit,
  History,
  BarChart2,
  LogOut,
  Settings,
} from "lucide-react";

const UserDropdown: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const { account } = useContext(UserContext);

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case "profile":
        window.location.href = "/personal-profile";
        break;
      case "upload":
        window.location.href = "/upload-document";
        break;
      case "edit":
        window.location.href = "/edit-profile";
        break;
      case "history":
        window.location.href = "/point-history";
        break;
      case "stats":
        window.location.href = "/stats";
        break;
      case "switch-to-admin":
        window.location.href = "/admin";
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
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Trang cá nhân</span>
              <User size={16} />
            </div>
          ),
        },
        {
          key: "upload",
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Đăng tải</span>
              <Upload size={16} />
            </div>
          ),
        },
        {
          key: "edit",
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Chỉnh sửa thông tin</span>
              <Edit size={16} />
            </div>
          ),
        },
        {
          key: "history",
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Lịch sử tích điểm</span>
              <History size={16} />
            </div>
          ),
        },
        {
          key: "stats",
          label: (
            <div className="flex justify-between items-center gap-4">
              <span>Thống kê</span>
              <BarChart2 size={16} />
            </div>
          ),
        },
        {
          type: "divider",
        },
        ...(account?.is_admin
          ? [
              {
                key: "switch-to-admin",
                label: (
                  <div className="flex justify-between items-center gap-4">
                    <span>Chuyển sang trang quản trị</span>
                    <Settings size={16} />
                  </div>
                ),
              },
            ]
          : []),
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

export default UserDropdown;
