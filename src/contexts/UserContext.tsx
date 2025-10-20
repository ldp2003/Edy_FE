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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPersonalDocuments: (_docs: Document[]) => {},

  sharedDocuments: [] as SharedDocumentItem[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSharedDocuments: (_docs: SharedDocumentItem[]) => {},

  favoriteDocuments: [] as Document[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFavoriteDocuments: (_docs: Document[]) => {},
  readHistory: [] as ReadHistoryItem[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setReadHistory: (_history: ReadHistoryItem[]) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addToReadHistory: (_document: Document) => {},
  notifications: [] as Notification[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setNotifications: (_notifications: Notification[]) => {},
  unreadCount: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUnreadCount: (_count: number) => {},
  refreshNotifications: () => {},
});
