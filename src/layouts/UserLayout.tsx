import React, { useState } from "react";
import { Header } from "../components/common/header/Header";
import { Sidebar } from "../components/user/sideMenu/SideBar";
import { Outlet } from "react-router-dom";

const UserLayout: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <Header></Header>
      <main className="w-full h-full">
        <div className="flex h-full">
          <Sidebar
            isVisible={isSidebarVisible}
            setIsVisible={setIsSidebarVisible}
          ></Sidebar>
          <div
            className={`flex-grow mt-20 transition-all duration-300 ${
              isSidebarVisible ? "ml-[20%] mr-[5%]" : "mx-[10%]"
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
