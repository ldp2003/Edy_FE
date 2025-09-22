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
      className="w-full h-full overflow-x-hidden"
      style={{
        backgroundColor: isDocumentDetailPage
          ? "var(--secondary-background-color)"
          : "var(--primary-background-color)",
      }}
    >
      <Header />
      <main className="w-full min-h-screen">
        <div className="flex min-h-screen">
          <Sidebar
            isVisible={isSidebarVisible}
            setIsVisible={setIsSidebarVisible}
          />

          {/* Modal overlay for document-detail page when sidebar is visible */}
          {isDocumentDetailPage && isSidebarVisible && (
            <div
              className="fixed inset-0 bg-black/50 bg-opacity-50 z-20"
              onClick={() => setIsSidebarVisible(false)}
            />
          )}

          <div
            className={`flex-grow mt-20 transition-all duration-300 ${
              isDocumentDetailPage
                ? "mx-[2%]" // Fixed margin for document detail page
                : isSidebarVisible
                ? "ml-[18%] mr-[1%]"
                : "mx-[10%]"
            }`}
          >
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
