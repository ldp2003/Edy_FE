import { Badge } from "antd";
import { Search, Shield, User } from "lucide-react";
import { Dropdown } from "antd";
import logo from "/public/image/Logo.png";
import AvatarDropdown from "../dropdown/AvatarDropdown";
import UploadHeaderButton from "../buttons/UploadHeaderButton";
import { useContext, useEffect, useState } from "react";
import UserDropdown from "../dropdown/UserDropdown";
import AdminDropdown from "../dropdown/AdminDropdown";
import { UserContext } from "../../../contexts/UserContext";
import NotificationDropdown from "../Notification/NotificationDropdown";

export function Header() {
  const {
    isLoggedIn,
    user,
    account,
    notifications,
    unreadCount,
    refreshNotifications,
  } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  // Detect if we're on admin page
  const isOnAdminPage = window.location.pathname.startsWith("/admin");
  const isOnSearchPage = window.location.pathname.startsWith("/search");

  const handleHeaderSearch = () => {
    const input = document.getElementById("search-input") as HTMLInputElement;
    const query = input?.value.trim();
    console.log("Header handleHeaderSearch called with:", query);
    console.log("isOnSearchPage:", isOnSearchPage);

    if (!query) {
      console.log("No query provided, returning");
      return;
    }

    if (isOnSearchPage) {
      // If already on search page, trigger SearchHeader's search function
      console.log("On search page, dispatching headerSearch event");
      const event = new CustomEvent("headerSearch", { detail: { query } });
      window.dispatchEvent(event);
      // Clear the header input after search
      input.value = "";
    } else {
      // If not on search page, navigate to search page
      console.log(
        "Not on search page, navigating to:",
        `/search?q=${encodeURIComponent(query)}`
      );
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const handleModeToggle = () => {
    if (isOnAdminPage) {
      // Currently on admin page, switch to user page
      window.location.href = "/";
    } else {
      // Currently on user page, switch to admin page
      window.location.href = "/admin";
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true);
      refreshNotifications();
      setLoading(false);
    }
  }, [isLoggedIn, refreshNotifications]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-2 w-full flex-shrink-0 shadow-sm text-sm">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          <div className="w-10 h-10 rounded flex items-center justify-center">
            <img src={logo} alt="Logo" />
          </div>
          <span className="text-[29px] font-bold bg-gradient-to-b from-[#50C4FE] to-[#3586DB] bg-clip-text text-transparent">
            EDY
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="search-input"
              placeholder="Nhập từ khóa tìm kiếm: Tên tài liệu, trường, môn học, tác giả..."
              className="pl-10 text-sm pr-24 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleHeaderSearch();
                }
              }}
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[var(--primary-color)] hover:bg-gray-700 text-white px-4 py-1 text-xs rounded transition-colors"
              onClick={handleHeaderSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <UploadHeaderButton></UploadHeaderButton>

              {/* Admin/User Mode Toggle Button - Only show for admins */}
              {account?.is_admin && (
                <button
                  onClick={handleModeToggle}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    isOnAdminPage
                      ? "bg-[var(--secondary-background-color)] text-[var(--primary-color)] hover:bg-blue-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                  title={
                    isOnAdminPage
                      ? "Chuyển sang trang người dùng"
                      : "Chuyển sang trang quản trị"
                  }
                >
                  {isOnAdminPage ? (
                    <>
                      <User className="w-4 h-4" />
                      <span>User</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Admin</span>
                    </>
                  )}
                </button>
              )}

              <Badge
                count={unreadCount > 9 ? "9+" : unreadCount}
                overflowCount={9}
                style={{ backgroundColor: "#ff4d4f" }}
                offset={[-4, 8]}
                size="small"
              >
                <NotificationDropdown
                  notifications={notifications}
                  loading={loading}
                />
              </Badge>

              <Dropdown
                overlay={
                  account?.is_admin ? <AdminDropdown /> : <UserDropdown />
                }
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        user?.avatar || "/placeholder.svg?height=32&width=32"
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const sibling = e.currentTarget
                          .nextElementSibling as HTMLElement | null;
                        if (sibling) {
                          sibling.style.display = "flex";
                        }
                      }}
                    />
                    <span className="text-xs font-medium text-gray-600 hidden">
                      NA
                    </span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--primary-color)" }}
                    >
                      {user?.first_name} {user?.last_name}
                    </span>
                    <div className="flex gap-1">
                      {account?.is_admin && (
                        <span className="text-xs bg-red-100 text-red-700 px-1 rounded font-medium">
                          Admin
                        </span>
                      )}
                      {account?.is_vip && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-1 rounded font-medium">
                          VIP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Dropdown>
            </>
          ) : (
            <Dropdown overlay={<AvatarDropdown />}>
              <button
                className="text-sm bg-[var(--primary-color)] hover:bg-white cursor-pointer hover:border-[var(--primary-color)] hover:border-1 hover:text-[var(--primary-color)] text-white px-4 py-2 rounded-md"
                onClick={() => {
                  // Logic to show login modal
                }}
              >
                Đăng nhập
              </button>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
}
