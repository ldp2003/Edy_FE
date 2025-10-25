/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getCurrentUser,
  refreshToken,
  hasValidToken,
} from "../utils/AuthService";
import { UserProvider } from "../contexts/UserProvider";
import type { User } from "../models/user";
import { defaultUser } from "../models/user";
import { ROLE_CODES } from "../constants/RoleConstants";
import type { RoleCode } from "../models/role";
import { getIsAdminMode } from "../utils/CookieUtils";
import { UserService } from "../utils/UserService";
import type { Document } from "../models/document";
import type {
  ReadHistoryItem,
  SharedDocumentItem,
} from "../contexts/UserContext";
import { DocumentService } from "../utils/DocumentService";
import { NotificationService } from "../utils/NotificationService";
import type { Notification } from "../models/notification";

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [role, setRole] = useState<RoleCode | null>(null);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteDocuments, setFavoriteDocuments] = useState<Document[]>([]);
  const [readHistory, setReadHistory] = useState<ReadHistoryItem[]>([]);
  const [personalDocuments, setPersonalDocuments] = useState<Document[]>([]);
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocumentItem[]>(
    []
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Ref để đảm bảo chỉ chạy authentication một lần
  const hasInitialized = useRef(false);
  const [dataFetched, setDataFetched] = useState(false);

  // Function to fetch notifications - wrapped in useCallback to prevent infinite loops
  const fetchNotifications = React.useCallback(async () => {
    try {
      console.log("🔄 Fetching notifications...");
      const notificationRes = await NotificationService.getNotifications({
        page: 1,
        limit: 50,
      });
      setNotifications(notificationRes.notifications);

      const unread = notificationRes.notifications.filter(
        (notification) => !notification.isRead
      ).length;
      setUnreadCount(unread);
      console.log(
        "✅ Fetched notifications:",
        notificationRes.notifications.length,
        "items"
      );
    } catch (notifError) {
      console.warn(
        "⚠️ Failed to get notifications (non-critical):",
        notifError
      );
    }
  }, []);

  const fetchUserDocuments = async () => {
    try {
      const response = await DocumentService.getMyDocuments({
        page: 1,
        limit: 100,
      });
      if (response && response.documents) {
        return response.documents;
      }
      return [];
    } catch (error) {
      console.error("Error fetching user documents:", error);
      return [];
    }
  };

  useEffect(() => {
    // Ngăn chặn việc chạy nhiều lần do React StrictMode
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Kiểm tra có token hợp lệ không trước khi refresh
        const hasToken = await hasValidToken();
        if (hasToken) {
          try {
            await refreshToken(); // Chỉ refresh nếu có token
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (refreshError) {
            console.log("🔄 Token refresh failed, proceeding without refresh");
            // Không throw error, tiếp tục với getCurrentUser()
          }
        }

        // Luôn gọi getCurrentUser() để kiểm tra trạng thái auth
        const data = await getCurrentUser();
        console.log("🔍 Current user data:", data);
        if (data) {
          setIsLoggedIn(true);
          setUser(data.user);
          setRole(data.roles);
          setAccount(data.account);

          // Extract read history from user data and ensure type safety
          const rawReadHistory = data.user?.read_history || [];
          const userReadHistory: ReadHistoryItem[] = rawReadHistory.map(
            (item: any) => ({
              document:
                item.document && typeof item.document === "object"
                  ? (item.document as Document)
                  : null,
              read_at: item.read_at,
              _id: item._id,
            })
          );
          setReadHistory(userReadHistory);
          console.log("📚 User Read History:", userReadHistory.length, "items");

          // Get shared documents from user data (populated with full document objects)
          const rawSharedDocs = data.user?.shared_documents || [];
          const userSharedDocs: SharedDocumentItem[] = rawSharedDocs.map(
            (item: any) => ({
              document:
                typeof item.document === "string"
                  ? null
                  : (item.document as Document | null),
              shared_at: item.shared_at,
              _id: item._id || `shared_${item.shared_at}`,
            })
          );
          setSharedDocuments(userSharedDocs);

          // Fetch additional data only once
          if (!dataFetched) {
            const personalDocs = await fetchUserDocuments();
            setPersonalDocuments(personalDocs);

            // Try to get favorites, but don't fail if it errors
            try {
              console.log("🔄 Getting favorite documents...");
              const favoriteRes = await UserService.getListFavorites();
              const favoriteDocuments = favoriteRes?.documents || [];
              console.log(
                "✅ Got favorite documents:",
                favoriteDocuments.length,
                "items"
              );
              setFavoriteDocuments(favoriteDocuments);
            } catch (favError) {
              console.warn(
                "⚠️ Failed to get favorite documents (non-critical):",
                favError
              );
            }

            // Fetch notifications
            await fetchNotifications();

            setDataFetched(true);
          }

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
          setReadHistory([]);
          setPersonalDocuments([]);
          setSharedDocuments([]);
          setNotifications([]);
          setUnreadCount(0);

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
        setReadHistory([]);
        setSharedDocuments([]);

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
        setIsLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi component mount

  // Show loading only during initial authentication check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <UserProvider
      isLoggedIn={isLoggedIn}
      user={user}
      account={account}
      role={role}
      favoriteDocuments={favoriteDocuments}
      setFavoriteDocuments={setFavoriteDocuments}
      readHistory={readHistory}
      setReadHistory={setReadHistory}
      personalDocuments={personalDocuments}
      setPersonalDocuments={setPersonalDocuments}
      sharedDocuments={sharedDocuments}
      setSharedDocuments={setSharedDocuments}
      notifications={notifications}
      setNotifications={setNotifications}
      unreadCount={unreadCount}
      setUnreadCount={setUnreadCount}
      refreshNotifications={fetchNotifications}
    >
      {children}
    </UserProvider>
  );
};

export default AuthRoute;
