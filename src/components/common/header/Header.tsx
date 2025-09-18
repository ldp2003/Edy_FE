import { Search, Bell } from "lucide-react";
import { Dropdown } from "antd";
import logo from "/public/image/Logo.png";
import AvatarDropdown from "../dropdown/AvatarDropdown";
import UploadHeaderButton from "../buttons/UploadHeaderButton";
import { useContext } from "react";
import UserDropdown from "../dropdown/UserDropdown";
import { UserContext } from "../../../contexts/UserContext";

export function Header() {
  const { isLoggedIn, user } = useContext(UserContext);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 fixed left-0 top-0 w-full z-50 shadow-b shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded flex items-center justify-center">
            <img src={logo} alt="Logo" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-b from-[#50C4FE] to-[#3586DB] bg-clip-text text-transparent">
            EDY
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Nhập từ khóa tìm kiếm: Tên tài liệu, trường, môn học, tác giả..."
              className="pl-10 text-sm pr-24 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 text-xs rounded transition-colors">
              Tìm kiếm
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <UploadHeaderButton></UploadHeaderButton>
              <button className="p-2 hover:bg-gray-100 rounded-md transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <Dropdown overlay={<UserDropdown />}>
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img
                      src="/placeholder.svg?height=32&width=32"
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
                  <span
                    className="text-sm font-medium "
                    style={{ color: "var(--primary-color)" }}
                  >
                    {user?.first_name} {user?.last_name}
                  </span>
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
