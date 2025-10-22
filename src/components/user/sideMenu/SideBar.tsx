import { UserProfile } from "./UserProfile";
import { NavigationMenu } from "./NavigationMenu";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

interface SidebarProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export function Sidebar({ isVisible, setIsVisible }: SidebarProps) {
  const location = useLocation();

  useEffect(() => {
    // Automatically hide the sidebar when on the document detail page
    if (location.pathname.includes("/document-detail")) {
      setIsVisible(false);
    }
  }, [location.pathname, setIsVisible]);

  return (
    <aside
      className={`border-r border-gray-200 bg-white transition-all duration-300 flex flex-col relative min-h-dvh ${
        isVisible ? "w-64 flex-shrink-0" : "w-16 flex-shrink-0"
      }`}
    >
      <button
        className="absolute top-4 -right-3 text-gray-600 bg-white p-1.5 z-10 rounded-full shadow-md cursor-pointer border border-gray-300 transition-all duration-300 hover:bg-gray-50"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? (
          <PanelLeftClose className="w-3 h-3 text-[var(--primary-text-color)]" />
        ) : (
          <PanelLeftOpen className="w-3 h-3 text-[var(--primary-text-color)]" />
        )}
      </button>
      <UserProfile isCompact={!isVisible} />
      <NavigationMenu isCompact={!isVisible} />
    </aside>
  );
}
