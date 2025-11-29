import { AdminNavigationMenu } from "./AdminNavigationMenu";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { roleTranslations } from "../../../locales/documentEnums";

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

  const { user, role } = useContext(UserContext);

  const handleUserInfoClick = () => {
    navigate("/personal-profile");
  };

  return (
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
          <PanelLeftClose
            className="w-3 h-3"
            style={{ color: "var(--primary-text-color)" }}
          />
        ) : (
          <PanelLeftOpen
            className="w-3 h-3"
            style={{ color: "var(--primary-text-color)" }}
          />
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
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <img
              src={user?.avatar || ""}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          {isVisible && (
            <div className="text-left">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--primary-text-color)" }}
              >
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : "Admin"}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--secondary-text-color)" }}
              >
                {roleTranslations[role as keyof typeof roleTranslations] ||
                  "Quản trị viên"}
              </p>
            </div>
          )}
        </div>
      </div>

      <AdminNavigationMenu isCompact={!isVisible} />
    </aside>
  );
}
