import React, { useState, useCallback } from "react";
import type { ReactNode } from "react";
import { UserContext } from "./UserContext";
import { NotificationService } from "../utils/NotificationService";
import type { User } from "../models/user";
import type { Account } from "../models/account";
import type { Document } from "../models/document";
import type { Notification } from "../models/notification";

interface UserProviderProps {
  children: ReactNode;
  isLoggedIn: boolean;
  user: User | null;
  account: Account | null;
  role: string | null;
  favoriteDocuments: Document[];
  setFavoriteDocuments: (docs: Document[]) => void;
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  isLoggedIn,
  user,
  account,
  role,
  favoriteDocuments,
  setFavoriteDocuments,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = useCallback(async () => {
    if (!isLoggedIn) return;

    try {
      const response = await NotificationService.getNotifications({
        page: 1,
        limit: 50,
      });
      setNotifications(response.notifications);

      const unread = response.notifications.filter(
        (notification) => !notification.isRead
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    }
  }, [isLoggedIn]);

  const contextValue = {
    isLoggedIn,
    user,
    account,
    role,
    favoriteDocuments,
    setFavoriteDocuments,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    refreshNotifications,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
