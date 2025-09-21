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
  const [role, setRole] = useState<RoleCode | null>(null);
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
          setRole(data.role); // User role
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
              // User có admin role, nhưng vẫn có thể truy cập trang user
              const isAdminMode = getIsAdminMode();

              // Chỉ redirect đến role selection khi chưa có lựa chọn role
              if (
                isAdminMode === null &&
                location.pathname !== "/role-selection"
              ) {
                navigate("/role-selection");
              }
              // Admin có thể tự do truy cập trang user hoặc admin sau khi đã chọn role
            }
            // If user doesn't have admin role, continue normally without role selection
          }
        } else {
          // User not authenticated
          setIsLoggedIn(false);
          setUser(defaultUser);
          setAccount(null);
          setRole(null);

          // Allow access to public pages without redirecting
          const publicPages = ["/", "/document-detail"];
          const isPublicPage = publicPages.some(
            (page) =>
              location.pathname === page ||
              (page === "/document-detail" &&
                location.pathname.startsWith("/document-detail/"))
          );

          if (!isPublicPage) {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error during auth check:", error);
        setIsLoggedIn(false);
        setUser(defaultUser);
        setAccount(null);
        setRole(null);

        // Allow access to public pages even when auth fails
        const publicPages = ["/", "/document-detail"];
        const isPublicPage = publicPages.some(
          (page) =>
            location.pathname === page ||
            (page === "/document-detail" &&
              location.pathname.startsWith("/document-detail/"))
        );

        if (!isPublicPage) {
          navigate("/");
        }
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
    <UserContext.Provider value={{ isLoggedIn, user, account, role }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthRoute;
