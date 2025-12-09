import { AdminNavigationMenu } from "./AdminNavigationMenu";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";

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

  const { user } = useContext(UserContext);

  const handleUserInfoClick = () => {
    navigate("/personal-profile");
  };

  const handleOrganizationClick = () => {
    if (
      user?.organization &&
      typeof user.organization === "object" &&
      user.organization._id
    ) {
      navigate(`/organization/${user.organization._id}`);
    }
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
            <span className="text-xs font-medium text-gray-600 hidden">NA</span>
          </div>
          {isVisible && (
            <div className="text-left flex-1">
              <div
                className="font-bold text-sm cursor-pointer hover:underline"
                onClick={() => (window.location.href = "/personal-profile")}
              >
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : "Admin"}
              </div>
              <div className="flex gap-1">
                <span className="text-xs bg-red-100 text-red-700 px-1 rounded font-medium">
                  Quản trị viên
                </span>
              </div>
              <p
                className="text-xs font-medium overflow-hidden whitespace-nowrap text-ellipsis cursor-pointer hover:underline text-[var(--primary-color)]"
                style={{ maxWidth: "150px" }}
                onClick={handleOrganizationClick}
              >
                {typeof user?.organization === "string"
                  ? user.organization
                  : user?.organization?.name || "Chưa có tổ chức"}
              </p>
            </div>
          )}
        </div>
      </div>

      <AdminNavigationMenu isCompact={!isVisible} />
    </aside>
  );
}
