import { createContext } from "react";
import type { User } from "../models/user";
import type { Account } from "../models/account";
import type { Document } from "../models/document";

export const UserContext = createContext({
  isLoggedIn: false,
  user: null as User | null,
  account: null as Account | null,
  role: null as string | null,
  favoriteDocuments: [] as Document[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFavoriteDocuments: (_docs: Document[]) => {},
});
