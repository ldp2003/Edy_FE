import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, refreshToken } from "../utils/AuthService";
import { UserContext } from "../contexts/UserContext";
import type { User } from "../models/user";
import { defaultUser } from "../models/user";
import { ROLE_CODES } from "../constants/RoleConstants";
import type { RoleCode } from "../models/role";
import { getIsAdminMode } from "../utils/CookieUtils";
import { UserService } from "../utils/UserService";
import type { Document } from "../models/document";

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [role, setRole] = useState<RoleCode | null>(null);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [favoriteDocuments, setFavoriteDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      // Only show loading on initial load, not on route changes
      if (isInitialLoad) {
        setIsLoading(true);
      }
      try {
        console.log("🔄 Starting auth check...");

        console.log("🔄 Step 1: Refreshing token...");
        await refreshToken();
        console.log("✅ Token refreshed successfully");

        console.log("🔄 Step 2: Getting current user...");
        const data = await getCurrentUser();
        console.log("✅ Got current user data:", data);

        // Try to get favorites, but don't fail if it errors
        let favoriteDocuments: Document[] = [];
        try {
          console.log("🔄 Step 3: Getting favorite documents...");
          const favoriteRes = await UserService.getListFavorites();
          favoriteDocuments = favoriteRes?.documents || [];
          console.log(
            "✅ Got favorite documents:",
            favoriteDocuments.length,
            "items"
          );
        } catch (favError) {
          console.warn(
            "⚠️ Failed to get favorite documents (non-critical):",
            favError
          );
          // Continue with empty favorites - this shouldn't block authentication
        }

        if (data) {
          setIsLoggedIn(true);
          setUser(data.user); // Full user data
          setRole(data.role); // User role
          setAccount(data.account); // Account data
          setFavoriteDocuments(favoriteDocuments);

          // Debug user verification status
          console.log("🔍 Checking verification status:");
          console.log("  - data.roles:", data.roles);
          console.log("  - data.account:", data.account);
          console.log("  - data.user:", data.user);

          // Check if user needs account activation
          const needsVerification =
            data.roles &&
            (data.roles.includes("NOT_VERIFIED") ||
              data.roles.includes("NOT_VERIFY") ||
              data.roles.includes("PENDING_VERIFICATION"));

          console.log("  - needsVerification:", needsVerification);

          if (needsVerification) {
            console.log(
              "➡️ User needs verification, redirecting to activation page"
            );
            // Only redirect if not already on activation page
            if (location.pathname !== "/account-activation") {
              navigate("/account-activation");
              return; // Exit early to avoid further processing
            }
          } else {
            console.log("✅ User is verified, proceeding with role checks");
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
          setFavoriteDocuments([]);

          // Allow access to public pages without redirecting
          const publicPages = ["/", "/document-detail", "/search"];
          const isPublicPage = publicPages.some(
            (page) =>
              location.pathname === page ||
              (page === "/document-detail" &&
                location.pathname.startsWith("/document-detail/")) ||
              (page === "/search" && location.pathname.startsWith("/search"))
          );

          if (!isPublicPage) {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("❌ Error during auth check:", error);

        // Log detailed error information
        if (error && typeof error === "object") {
          const axiosError = error as {
            message?: string;
            response?: {
              status?: number;
              statusText?: string;
              data?: unknown;
            };
          };
          console.error("❌ Error details:", {
            message: axiosError.message,
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
          });

          // Handle specific error cases
          if (axiosError.response?.status === 403) {
            console.log(
              "🔐 403 Forbidden - Token expired, invalid, or account not verified"
            );

            // Check if error message indicates account not verified
            const errorData = axiosError.response.data as {
              message?: string;
              code?: string;
            };
            if (
              errorData?.message?.includes("not verified") ||
              errorData?.message?.includes("NOT_VERIFIED") ||
              errorData?.code === "ACCOUNT_NOT_VERIFIED"
            ) {
              console.log(
                "📧 Account needs verification - redirecting to activation page"
              );
              if (location.pathname !== "/account-activation") {
                navigate("/account-activation");
                return; // Exit early to avoid further processing
              }
            }

            // Clear any stored tokens/cookies here if needed
            // deleteCookie("token"); // if you store token in cookies
          } else if (axiosError.response?.status === 401) {
            console.log("🔐 401 Unauthorized - User not authenticated");
          } else if (axiosError.response?.status === 500) {
            console.log("🔴 500 Server Error - Backend issue");
          }
        }

        // Reset auth state
        setIsLoggedIn(false);
        setUser(defaultUser);
        setAccount(null);
        setRole(null);
        setFavoriteDocuments([]);

        // Allow access to public pages even when auth fails
        const publicPages = ["/", "/document-detail", "/search"];
        const isPublicPage = publicPages.some(
          (page) =>
            location.pathname === page ||
            (page === "/document-detail" &&
              location.pathname.startsWith("/document-detail/")) ||
            (page === "/search" && location.pathname.startsWith("/search"))
        );

        if (!isPublicPage) {
          console.log("🔄 Redirecting to home page due to auth failure");
          navigate("/");
        } else {
          console.log("📄 Staying on public page despite auth failure");
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
    <UserContext.Provider
      value={{
        isLoggedIn,
        user,
        account,
        role,
        favoriteDocuments,
        setFavoriteDocuments,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default AuthRoute;
