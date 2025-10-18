import React, { useState, useCallback } from "react";
import type { ReactNode } from "react";
import {
  UserContext,
  type ReadHistoryItem,
  type SharedDocumentItem,
} from "./UserContext";
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
  readHistory: ReadHistoryItem[];
  setReadHistory: (history: ReadHistoryItem[]) => void;
  personalDocuments: Document[];
  setPersonalDocuments: (docs: Document[]) => void;
  sharedDocuments: SharedDocumentItem[];
  setSharedDocuments: (docs: SharedDocumentItem[]) => void;
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  isLoggedIn,
  user,
  account,
  role,
  favoriteDocuments,
  setFavoriteDocuments,
  readHistory,
  setReadHistory,
  personalDocuments,
  setPersonalDocuments,
  sharedDocuments,
  setSharedDocuments,
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

  // Function to add a document to read history
  const addToReadHistory = useCallback(
    (document: Document) => {
      const newHistoryItem: ReadHistoryItem = {
        document,
        read_at: new Date().toISOString(),
        _id: `${document._id}_${Date.now()}`, // Generate temporary ID
      };

      // Remove existing entry if document was already viewed
      const filteredHistory = readHistory.filter(
        (item: ReadHistoryItem) => item.document._id !== document._id
      );
      // Add new entry at the beginning and keep only last 50 items
      const updatedHistory = [newHistoryItem, ...filteredHistory].slice(0, 50);
      setReadHistory(updatedHistory);
    },
    [readHistory, setReadHistory]
  );

  const contextValue = {
    isLoggedIn,
    user,
    account,
    role,
    favoriteDocuments,
    setFavoriteDocuments,
    readHistory,
    setReadHistory,
    personalDocuments,
    setPersonalDocuments,
    sharedDocuments,
    setSharedDocuments,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
    refreshNotifications,
    addToReadHistory, // Added to context value
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
