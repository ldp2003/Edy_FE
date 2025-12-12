import React, { useState, useEffect, useRef } from "react";
import { Header } from "../components/common/header/Header";
import { AdminSidebar } from "../components/admin/sideMenu/AdminSidebar";
import { AdminNavigationMenu } from "../components/admin/sideMenu/AdminNavigationMenu";
import AdminFooter from "../components/common/footer/AdminFooter";
import { Outlet, useLocation } from "react-router-dom";
import { MobileNavBar } from "../components/common/navigation/MobileNavBar";
import { MobileSidebar } from "../components/common/navigation/MobileSidebar";

const AdminLayout: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to top when route changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Set sidebar visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsSidebarVisible(!isMobile);
      if (!isMobile) {
        setIsMobileSidebarVisible(false);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuToggle = () => {
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      setIsMobileSidebarVisible(!isMobileSidebarVisible);
    } else {
      setIsSidebarVisible(!isSidebarVisible);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--secondary-background-color)]">
      {/* Header - cố định ở trên cùng */}
      <div className="relative z-[200] flex-shrink-0">
        <Header onMenuToggle={handleMenuToggle} />
      </div>

      {/* Content area bên dưới header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar - chỉ hiển thị trên desktop */}
        <div className="hidden z-20 lg:block">
          <AdminSidebar
            isVisible={isSidebarVisible}
            setIsVisible={setIsSidebarVisible}
          />
        </div>

        {/* Page content - có thể scroll */}
        <main
          ref={mainRef}
          className="flex-1 relative overflow-y-auto focus:outline-none"
        >
          <div className="flex flex-col min-h-full">
            <div className="flex-1 p-4 md:p-6">
              <Outlet />
            </div>
            {/* Footer - ở cuối content */}
            <AdminFooter />
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNavBar onMenuClick={handleMenuToggle} isAdmin={true} />

      {/* Mobile Sidebar Modal */}
      <MobileSidebar
        isVisible={isMobileSidebarVisible}
        onClose={() => setIsMobileSidebarVisible(false)}
      >
        <AdminNavigationMenu isCompact={false} />
      </MobileSidebar>
    </div>
  );
};

export default AdminLayout;
