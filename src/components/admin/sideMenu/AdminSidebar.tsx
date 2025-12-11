import { AdminNavigationMenu } from "./AdminNavigationMenu";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { getRoleDisplayName } from "../../../constants/RoleConstants";

interface AdminSidebarProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export function AdminSidebar({ isVisible, setIsVisible }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Keep sidebar visible by default for admin pages
    // You can add specific logic here if needed
  }, [location.pathname, setIsVisible]);

  const { user, roles } = useContext(UserContext);

  // Chọn role hiển thị: ưu tiên SUPER_ADMIN, else role đầu tiên
  const displayRole = roles?.includes("SUPER_ADMIN")
    ? "SUPER_ADMIN"
    : roles?.[0] || "CUSTOM_ROLE";

  const handleUserInfoClick = () => {
    navigate("/personal-profile");
  };

  return (
    // console.log("Rendering AdminSidebar with user:", user),
    (
      <aside
        className={`border-r border-gray-200 bg-white transition-all h-full duration-300 flex flex-col relative ${
          isVisible ? "w-64 flex-shrink-0" : "w-16 flex-shrink-0"
        }`}
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <button
          className="absolute top-4 -right-3 text-gray-600 bg-white p-1.5 z-10 rounded-full shadow-md cursor-pointer border border-gray-300 transition-all duration-300 hover:bg-gray-50"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? (
            <PanelLeftClose className="w-3 h-3" />
          ) : (
            <PanelLeftOpen className="w-3 h-3" />
          )}
        </button>

        {/* Admin info section - dynamic from context */}
        <div
          className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
            !isVisible ? "px-2" : ""
          }`}
          onClick={handleUserInfoClick}
        >
          <div
            className={`flex items-center gap-3 ${
              !isVisible ? "justify-center" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={user?.avatar || "/image/avatar-default.svg"}
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
            {isVisible && (
              <div className="text-left flex-1">
                <div
                  className="font-bold text-sm cursor-pointer hover:underline text-left text-[var(--primary-color)]"
                  onClick={() => (window.location.href = "/personal-profile")}
                >
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : "Admin"}
                </div>
                <div className="flex text-left gap-1">
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
            )}
          </div>
        </div>

        <AdminNavigationMenu isCompact={!isVisible} />
      </aside>
    )
  );
}
