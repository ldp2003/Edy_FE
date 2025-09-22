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
      className={`border-r top-15 fixed z-30 border-gray-200 min-h-screen bg-white transition-all duration-300 flex flex-col  ${
        isVisible ? "w-fit" : "w-16"
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
      <UserProfile isCompact={!isVisible} />
      <NavigationMenu isCompact={!isVisible} />
    </aside>
  );
}
