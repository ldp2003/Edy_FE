import React, { useState, useEffect } from "react";
import { Header } from "../components/common/header/Header";
import { Sidebar } from "../components/user/sideMenu/SideBar";
import { NavigationMenu } from "../components/user/sideMenu/NavigationMenu";
import UserFooter from "../components/common/footer/UserFooter";
import { Outlet, useLocation } from "react-router-dom";
import { MobileNavBar } from "../components/common/navigation/MobileNavBar";
import { MobileSidebar } from "../components/common/navigation/MobileSidebar";

const UserLayout: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const location = useLocation();
  const isDocumentDetailPage = location.pathname.includes("/document-detail");

  // Set sidebar visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsSidebarVisible(!isMobile);
      if (!isMobile) {
        setIsMobileSidebarVisible(false);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsMobileSidebarVisible(!isMobileSidebarVisible);
    } else {
      setIsSidebarVisible(!isSidebarVisible);
    }
  };

  return (
    <div className="h-screen bg-[var(--secondary-background-color)] flex flex-col overflow-hidden">
      {/* Header - cố định ở trên cùng */}
      <div className="relative z-10 flex-shrink-0">
        <Header onMenuToggle={handleMenuToggle} />
      </div>

      {/* Content area bên dưới header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - chỉ hiển thị trên desktop */}
        <div className="hidden md:block">
          <Sidebar
            isVisible={isSidebarVisible}
            setIsVisible={setIsSidebarVisible}
          />
        </div>

        {/* Page content - có thể scroll */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="flex flex-col min-h-full">
            <div
              className={`flex-1 transition-all duration-300 ${
                isDocumentDetailPage
                  ? "" // No padding for document detail page
                  : isSidebarVisible
                  ? "px-4 md:px-20" // Normal padding when sidebar is open
                  : "px-4 md:px-30 lg:min-w-lg" // Center content when sidebar is closed
              }`}
            >
              <Outlet />
            </div>
            {/* Footer - ở cuối content */}
            <UserFooter />
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNavBar onMenuClick={handleMenuToggle} />

      {/* Mobile Sidebar Modal */}
      <MobileSidebar
        isVisible={isMobileSidebarVisible}
        onClose={() => setIsMobileSidebarVisible(false)}
      >
        <NavigationMenu isCompact={false} />
      </MobileSidebar>
    </div>
  );
};

export default UserLayout;
