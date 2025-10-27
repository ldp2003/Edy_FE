import React, { useCallback } from "react";
import type { ReactNode } from "react";
import {
  UserContext,
  type ReadHistoryItem,
  type SharedDocumentItem,
} from "./UserContext";
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
  setFavoriteDocuments: (
    docs: Document[] | ((prev: Document[]) => Document[])
  ) => void;
  readHistory: ReadHistoryItem[];
  setReadHistory: (history: ReadHistoryItem[]) => void;
  personalDocuments: Document[];
  setPersonalDocuments: (docs: Document[]) => void;
  sharedDocuments: SharedDocumentItem[];
  setSharedDocuments: (docs: SharedDocumentItem[]) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  refreshNotifications?: () => Promise<void>;
  setUser?: (user: User | null) => void;
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
  notifications,
  setNotifications,
  unreadCount,
  setUnreadCount,
  refreshNotifications: propRefreshNotifications,
  setUser: propSetUser,
}) => {
  // Refresh notifications function - use the one passed from AuthRoute
  const refreshNotifications = useCallback(async () => {
    if (propRefreshNotifications) {
      await propRefreshNotifications();
    } else {
      console.log("No refresh function provided from AuthRoute");
    }
  }, [propRefreshNotifications]);

  // Function to add a document to read history
  const addToReadHistory = useCallback(
    (document: Document) => {
      const newHistoryItem: ReadHistoryItem = {
        document,
        read_at: new Date().toISOString(),
        _id: `${document._id}_${Date.now()}`, // Generate temporary ID
      };

      // Remove existing entry if document was already viewed
      // Handle cases where item.document might be null/undefined
      const filteredHistory = readHistory.filter((item: ReadHistoryItem) => {
        // Skip items without document object
        if (!item.document || !item.document._id) {
          return true; // Keep these items but don't compare
        }
        return item.document._id !== document._id;
      });
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
    setUser: propSetUser || (() => {}),
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
