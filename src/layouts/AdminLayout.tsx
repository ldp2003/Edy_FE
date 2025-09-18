import React, { useState } from "react";
import { Header } from "../components/common/header/Header";
import { AdminSidebar } from "../components/admin/sideMenu/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div
      className="w-full h-full overflow-x-hidden"
      style={{
        backgroundColor: "var(--primary-background-color)",
      }}
    >
      <Header />
      <main className="w-full min-h-screen">
        <div className="flex min-h-screen">
          <AdminSidebar
            isVisible={isSidebarVisible}
            setIsVisible={setIsSidebarVisible}
          />

          <div
            className={`flex-grow mt-24 transition-all duration-300 ${
              isSidebarVisible ? "ml-[18%] mr-[1%]" : "mx-[10%]"
            }`}
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
