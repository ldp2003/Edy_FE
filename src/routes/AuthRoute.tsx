import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, refreshToken } from "../utils/AuthService";
import { UserContext } from "../contexts/UserContext";
import type { User } from "../models/user";
import { defaultUser } from "../models/user";
import { ROLE_CODES } from "../constants/RoleConstants";
import type { RoleCode } from "../models/role";
import { getIsAdminMode } from "../utils/CookieUtils";

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Only show loading on initial load, not on route changes
      if (isInitialLoad) {
        setIsLoading(true);
      }
      try {
        await refreshToken();
        const data = await getCurrentUser();

        if (data) {
          setIsLoggedIn(true);
          setUser(data.user); // Full user data
          setAccount(data.account); // Account data

          // Check if user needs account activation
          if (
            data.roles &&
            (data.roles.includes("NOT_VERIFIED") ||
              data.roles.includes("NOT_VERIFY"))
          ) {
            // Only redirect if not already on activation page
            if (location.pathname !== "/account-activation") {
              navigate("/account-activation");
            }
          } else {
            // Check if user has any admin role
            const adminRoles = [
              ROLE_CODES.SUPER_ADMIN,
              ROLE_CODES.DOCUMENT_ADMIN,
              ROLE_CODES.USER_ADMIN,
              ROLE_CODES.SYSTEM_ADMIN,
              ROLE_CODES.ENTITY_ADMIN,
            ];

            const hasAdminRole =
              data.roles &&
              data.roles.some((role: string) =>
                adminRoles.includes(role as RoleCode)
              );

            if (hasAdminRole) {
              // User có admin role, check cookie để xác định chế độ
              const isAdminMode = getIsAdminMode();

              if (isAdminMode) {
                // User đã chọn chế độ admin, đảm bảo ở trang admin
                if (
                  !location.pathname.startsWith("/admin") &&
                  location.pathname !== "/role-selection"
                ) {
                  navigate("/admin");
                }
              } else {
                // User chưa chọn hoặc chọn chế độ user, hiển thị role selection
                if (
                  !location.pathname.startsWith("/admin") &&
                  location.pathname !== "/role-selection"
                ) {
                  navigate("/role-selection");
                }
              }
            }
            // If user doesn't have admin role, continue normally without role selection
          }
        } else {
          setIsLoggedIn(false);
          setUser(defaultUser);
          setAccount(null);
          navigate("/");
        }
      } catch (error) {
        console.error("Error during auth check:", error);
        setIsLoggedIn(false);
        setUser(defaultUser);
        setAccount(null);
        navigate("/");
      } finally {
        if (isInitialLoad) {
          setIsLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    checkAuth();
  }, [navigate, location.pathname, isInitialLoad]);

  // Show loading only during initial authentication check
  if (isLoading && isInitialLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ isLoggedIn, user, account }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthRoute;
