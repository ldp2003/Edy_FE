import { Search, Shield, User } from "lucide-react";
import { Dropdown } from "antd";
import logo from "/image/Logo.png";
import AvatarDropdown from "../dropdown/AvatarDropdown";
import UploadHeaderButton from "../buttons/UploadHeaderButton";
import { useContext } from "react";
import UserDropdown from "../dropdown/UserDropdown";
import AdminDropdown from "../dropdown/AdminDropdown";
import { UserContext } from "../../../contexts/UserContext";
import NotificationDropdown from "../Notification/NotificationDropdown";
import { getRoleDisplayName } from "../../../constants/RoleConstants";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { isLoggedIn, user, account, notifications, unreadCount, roles } =
    useContext(UserContext);

  // Chọn role hiển thị: ưu tiên SUPER_ADMIN, else role đầu tiên
  const displayRole = roles?.includes("SUPER_ADMIN")
    ? "SUPER_ADMIN"
    : roles?.[0] || "CUSTOM_ROLE";

  // Detect if we're on admin page
  const isOnAdminPage = window.location.pathname.startsWith("/admin");
  const isOnSearchPage = window.location.pathname.startsWith("/search");

  const handleHeaderSearch = () => {
    const input = document.getElementById("search-input") as HTMLInputElement;
    const query = input?.value.trim();
    // console.log("Header handleHeaderSearch called with:", query);
    // console.log("isOnSearchPage:", isOnSearchPage);

    if (!query) {
      // console.log("No query provided, returning");
      return;
    }

    if (isOnSearchPage) {
      // If already on search page, trigger SearchHeader's search function
      // console.log("On search page, dispatching headerSearch event");
      const event = new CustomEvent("headerSearch", { detail: { query } });
      window.dispatchEvent(event);
      // Clear the header input after search
      input.value = "";
    } else {
      // If not on search page, navigate to search page
      // console.log(
      //   "Not on search page, navigating to:",
      //   `/search?q=${encodeURIComponent(query)}`
      // );
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

  // Remove unnecessary notification fetching - handled by AuthRoute

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:w-screen md:px-6 py-2 w-full flex-shrink-0 z-[100] shadow-lg text-sm">
      <div className="flex items-center justify-between">
        {/* Menu Toggle Button - Only visible on mobile */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={onMenuToggle}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer mx-auto md:mx-0"
          onClick={() => (window.location.href = "/")}
        >
          <div className="w-8 md:w-10 h-8 md:h-10 rounded flex items-center justify-center">
            <img src={logo} alt="Logo" />
          </div>
          <span className="text-[24px] md:text-[29px] font-bold bg-gradient-to-b from-[#50C4FE] to-[#3586DB] bg-clip-text text-transparent">
            STUDYSHARE
          </span>
        </div>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
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
              className="absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2 bg-[var(--primary-color)] hover:bg-gray-700 text-white px-4 py-1 text-xs rounded transition-colors"
              onClick={handleHeaderSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2 md:gap-4">
          {isLoggedIn ? (
            <>
              <div className="hidden md:block">
                <UploadHeaderButton></UploadHeaderButton>
              </div>

              {/* Admin/User Mode Toggle Button - Only show for admins */}
              {account?.is_admin && (
                <button
                  onClick={handleModeToggle}
                  className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors ${
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

              <NotificationDropdown
                notifications={notifications}
                unreadCount={unreadCount}
              />

              <Dropdown
                popupRender={() =>
                  isOnAdminPage ? <AdminDropdown /> : <UserDropdown />
                }
                trigger={["hover"]}
                placement="bottomRight"
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
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-[var(--primary-color)] hover:underline">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <div className="flex gap-1">
                      <span
                        className={`text-xs px-1 rounded font-medium ${
                          displayRole === "SUPER_ADMIN"
                            ? "bg-[var(--color-error-bg)] text-[var(--color-error-text)]"
                            : displayRole === "CUSTOM_ROLE"
                            ? "bg-[var(--color-info-bg)] text-[var(--color-info-text)]"
                            : "bg-[var(--color-info-bg)] text-[var(--color-info-text)]"
                        }`}
                      >
                        {getRoleDisplayName(displayRole)}
                      </span>
                    </div>
                  </div>
                </div>
              </Dropdown>
            </>
          ) : (
            <Dropdown
              popupRender={() => <AvatarDropdown />}
              trigger={["hover"]}
              placement="bottomRight"
            >
              <button
                className="text-sm bg-[var(--primary-color)] hover:bg-white cursor-pointer hover:border-[var(--primary-color)] hover:border-1 hover:text-[var(--primary-color)] text-white px-2 md:px-4 py-2 rounded-md flex items-center gap-2"
                onClick={() => {}}
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline">Đăng nhập</span>
              </button>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
}
