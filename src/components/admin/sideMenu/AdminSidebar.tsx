import { AdminNavigationMenu } from "./AdminNavigationMenu";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

interface AdminSidebarProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export function AdminSidebar({ isVisible, setIsVisible }: AdminSidebarProps) {
  const location = useLocation();

  useEffect(() => {
    // Keep sidebar visible by default for admin pages
    // You can add specific logic here if needed
  }, [location.pathname, setIsVisible]);

  return (
    <aside
      className={`border-r top-20 fixed z-30 border-gray-200 min-h-screen bg-white transition-all duration-300 flex flex-col  ${
        isVisible ? "w-64" : "w-16"
      }`}
    >
      <button
        className="absolute top-4 -right-4 text-white bg-white p-2 z-30 rounded-full shadow-md cursor-pointer border border-gray-300 transition-all duration-300"
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

      {/* Admin info section - placeholder for now */}
      <div
        className={`p-4 border-b border-gray-200 ${!isVisible ? "px-2" : ""}`}
      >
        <div
          className={`flex items-center gap-3 ${
            !isVisible ? "justify-center" : ""
          }`}
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">A</span>
          </div>
          {isVisible && (
            <div>
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Quản trị viên</p>
            </div>
          )}
        </div>
      </div>

      <AdminNavigationMenu isCompact={!isVisible} />
    </aside>
  );
}
