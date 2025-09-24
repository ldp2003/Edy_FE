import React, { useState } from "react";
import { Header } from "../components/common/header/Header";
import { Sidebar } from "../components/user/sideMenu/SideBar";
import { Outlet, useLocation } from "react-router-dom";

const UserLayout: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const location = useLocation();

  const isDocumentDetailPage = location.pathname.includes("/document-detail");

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        backgroundColor: isDocumentDetailPage
          ? "var(--secondary-background-color)"
          : "var(--primary-background-color)",
      }}
    >
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
          <div
            className={`transition-all duration-300 ${
              isDocumentDetailPage
                ? "" // Padding for document detail page
                : "p-4"
            }`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
