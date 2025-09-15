import React, { useState, useEffect } from "react";
import { Header } from "../components/common/header/Header";
import { Sidebar } from "../components/user/sideMenu/SideBar";
import { Outlet, useLocation } from "react-router-dom";
import AuthRoute from "../routes/AuthRoute";
import { UserContext } from "../contexts/UserContext";
import { getCurrentUser } from "../utils/AuthService";
import type { User } from "../models/user";
import { defaultUser } from "../models/user";

const UserLayout: React.FC = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [account, setAccount] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        if (data) {
          setIsLoggedIn(true);
          setUser(data.user); // Full user data.
          setAccount(data.account); // Account data
        } else {
          setIsLoggedIn(false);
          setUser(defaultUser);
          setAccount(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const isAccountActivationPage = location.pathname === "/account-activation";
  const isDocumentDetailPage = location.pathname.includes("/document-detail");

  return (
    <AuthRoute>
      <UserContext.Provider value={{ isLoggedIn, user, account }}>
        <div
          className="w-screen min-h-screen overflow-x-hidden"
          style={{
            backgroundColor: isDocumentDetailPage
              ? "var(--secondary-background-color)"
              : "var(--primary-background-color)",
          }}
        >
          <Header />
          <main className="w-full min-h-screen">
            <div className="flex min-h-screen">
              {!isAccountActivationPage && (
                <Sidebar
                  isVisible={isSidebarVisible}
                  setIsVisible={setIsSidebarVisible}
                />
              )}
              <div
                className={`flex-grow mt-20 transition-all duration-300 ${
                  isSidebarVisible && !isAccountActivationPage
                    ? "ml-[20%] mr-[5%]"
                    : "mx-[10%]"
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
