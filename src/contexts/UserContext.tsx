import { createContext } from "react";
import type { User } from "../models/user";
import type { Account } from "../models/account";
import type { Document } from "../models/document";
import type { Notification } from "../models/notification";

export const UserContext = createContext({
  isLoggedIn: false,
  user: null as User | null,
  account: null as Account | null,
  role: null as string | null,
  favoriteDocuments: [] as Document[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFavoriteDocuments: (_docs: Document[]) => {},
  notifications: [] as Notification[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setNotifications: (_notifications: Notification[]) => {},
  unreadCount: 0,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setUnreadCount: (_count: number) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refreshNotifications: () => {},
});
