import React from "react";
import { Menu, message } from "antd";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../utils/AuthService";

const UserDropdown: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleMenuClick = async (e: { key: string }) => {
    switch (e.key) {
      case "profile":
        navigate("/profile");
        break;
      case "upload":
        navigate("/upload");
        break;
      case "edit":
        navigate("/edit-info");
        break;
      case "history":
        navigate("/point-history");
        break;
      case "stats":
        navigate("/stats");
        break;
      case "logout":
        try {
          await logout();
          messageApi.success("Đăng xuất thành công");
          navigate("/login");
        } catch (error) {
          messageApi.error("Đăng xuất thất bại");
          console.error("Logout failed:", error);
        }
        break;
      default:
        break;
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
    </>
  );
};

export default UserDropdown;
