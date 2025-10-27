import React, { useState, useContext } from "react";
import { Menu, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const { account } = useContext(UserContext);

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case "profile":
        navigate("/personal-profile");
        break;
      case "upload":
        navigate("/upload-document");
        break;
      case "edit":
        navigate("/edit-profile");
        break;
      case "history":
        navigate("/point-management?showHistory=true");
        break;
      case "stats":
        navigate("/stats");
        break;
      case "switch-to-admin":
        navigate("/admin");
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
      navigate("/");
    } catch (error) {
      messageApi.error("Đăng xuất thất bại");
      console.error("Logout failed:", error);
    } finally {
      setLogoutModalVisible(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Menu
        onClick={handleMenuClick}
        className="border-none"
        style={{ minWidth: 220 }}
        items={[
          {
            key: "profile",
            label: (
              <div className="flex justify-between items-center gap-4 text-gray-700 hover:text-blue-600">
                <span>Trang cá nhân</span>
                <User size={16} />
              </div>
            ),
          },
          {
            key: "upload",
            label: (
              <div className="flex justify-between items-center gap-4 text-gray-700 hover:text-blue-600">
                <span>Đăng tải</span>
                <Upload size={16} />
              </div>
            ),
          },
          {
            key: "edit",
            label: (
              <div className="flex justify-between items-center gap-4 text-gray-700 hover:text-blue-600">
                <span>Chỉnh sửa thông tin</span>
                <Edit size={16} />
              </div>
            ),
          },
          {
            key: "history",
            label: (
              <div className="flex justify-between items-center gap-4 text-gray-700 hover:text-blue-600">
                <span>Lịch sử tích điểm</span>
                <History size={16} />
              </div>
            ),
          },
          {
            key: "stats",
            label: (
              <div className="flex justify-between items-center gap-4 text-gray-700 hover:text-blue-600">
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
                    <div className="flex justify-between items-center gap-4 text-gray-700 hover:text-blue-600">
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
              <div className="flex justify-between items-center gap-4 text-red-600 hover:text-red-700">
                <span>Đăng xuất</span>
                <LogOut size={16} />
              </div>
            ),
          },
        ]}
      />
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
