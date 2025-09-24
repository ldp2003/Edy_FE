import { Dropdown } from "antd";
import logo from "/public/image/Logo.png";
import AccountDropdown from "../dropdown/AccountDropdown";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";

export function BlankHeader() {
  const { isLoggedIn, user } = useContext(UserContext);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 w-full flex-shrink-0">
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

        {/* User Info - Only show if logged in */}
        <div className="flex items-center">
          {isLoggedIn && (
            <Dropdown overlay={<AccountDropdown />}>
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
                  className="text-sm font-medium"
                  style={{ color: "var(--primary-color)" }}
                >
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
}
