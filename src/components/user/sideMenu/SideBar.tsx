import { UserProfile } from "./UserProfile";
import { NavigationMenu } from "./NavigationMenu";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface SidebarProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export function Sidebar({ isVisible, setIsVisible }: SidebarProps) {
  return (
    <>
      <button
        className={`fixed text-white bg-white p-2 z-10 rounded-full shadow-md cursor-pointer border border-gray-300 transition-all duration-300 ${
          isVisible ? "top-26 left-62" : "top-26 left-14"
        }`}
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

      <aside
        className={`border-r border-gray-200 min-h-screen fixed left-0 top-[80px] transition-transform duration-300 ${
          isVisible ? "w-64 translate-x-0" : "w-16 translate-x-0"
        }`}
      >
        <UserProfile isCompact={!isVisible} />
        <NavigationMenu isCompact={!isVisible} />
      </aside>
    </>
  );
}
