import React, { useState } from "react";
import { Header } from "../components/common/header/Header";
import { Sidebar } from "../components/user/sideMenu/SideBar";
import UserFooter from "../components/common/footer/UserFooter";
import { Outlet, useLocation } from "react-router-dom";

const UserLayout: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const location = useLocation();

  const isDocumentDetailPage = location.pathname.includes("/document-detail");

  return (
    <div className="h-screen bg-[var(--secondary-background-color)] flex flex-col overflow-hidden">
      {/* Header - cố định ở trên cùng */}
      <div className="relative z-10 flex-shrink-0">
        <Header />
      </div>

      {/* Content area bên dưới header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - cố định bên trái, dưới header */}
        <Sidebar
          isVisible={isSidebarVisible}
          setIsVisible={setIsSidebarVisible}
        />

        {/* Page content - có thể scroll */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="flex flex-col min-h-full">
            <div
              className={`flex-1 transition-all duration-300 ${
                isDocumentDetailPage
                  ? "" // No padding for document detail page
                  : isSidebarVisible
                  ? "px-20" // Normal padding when sidebar is open
                  : "px-25 min-w-xl" // Center content when sidebar is closed
              }`}
            >
              <Outlet />
            </div>
            {/* Footer - ở cuối content */}
            <UserFooter />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
