import React, { useState, useEffect } from "react";
import { Header } from "../components/common/header/Header";
import { Sidebar } from "../components/user/sideMenu/SideBar";
import { Outlet } from "react-router-dom";
import AuthRoute from "../routes/AuthRoute";
import { UserContext } from "../contexts/UserContext";
import { getCurrentUser } from "../utils/AuthService";
import type { User } from "../data/user";
import { defaultUser } from "../data/user";

const UserLayout: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        if (data) {
          setIsLoggedIn(true);
          setUser(data.user); // Full user data.
          setAccount(data.account); // Account data
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthRoute>
      <UserContext.Provider value={{ isLoggedIn, user, account }}>
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
      </UserContext.Provider>
    </AuthRoute>
  );
};

export default UserLayout;
