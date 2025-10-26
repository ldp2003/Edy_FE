/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";
import type { User } from "../models/user";
import type { Account } from "../models/account";
import type { Document } from "../models/document";
import type { Notification } from "../models/notification";

export interface ReadHistoryItem {
  document: Document | null;
  read_at: string;
  _id: string;
}

export interface SharedDocumentItem {
  document: Document | null;
  shared_at: string;
  _id: string;
}

export const UserContext = createContext({
  isLoggedIn: false,
  user: null as User | null,
  account: null as Account | null,
  role: null as string | null,
  personalDocuments: [] as Document[],
  setPersonalDocuments: (_docs: Document[]) => {},

  sharedDocuments: [] as SharedDocumentItem[],
  setSharedDocuments: (_docs: SharedDocumentItem[]) => {},

  favoriteDocuments: [] as Document[],
  setFavoriteDocuments: (
    _docs: Document[] | ((prev: Document[]) => Document[])
  ) => {},
  readHistory: [] as ReadHistoryItem[],
  setReadHistory: (_history: ReadHistoryItem[]) => {},
  addToReadHistory: (_document: Document) => {},
  notifications: [] as Notification[],
  setNotifications: (_notifications: Notification[]) => {},
  unreadCount: 0,
  setUnreadCount: (_count: number) => {},
  refreshNotifications: () => {},
  setUser: (_user: User | null) => {},
});
