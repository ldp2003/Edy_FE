import React, { useState } from "react";
import { Header } from "../components/common/header/Header";
import { AdminSidebar } from "../components/admin/sideMenu/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-[var(--secondary-background-color)]"
    >
      {/* Header - cố định ở trên cùng */}
      <div className="relative z-10 flex-shrink-0">
        <Header />
      </div>

      {/* Content area bên dưới header */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - cố định bên trái, dưới header */}
        <AdminSidebar
          isVisible={isSidebarVisible}
          setIsVisible={setIsSidebarVisible}
        />

        {/* Page content - có thể scroll */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
