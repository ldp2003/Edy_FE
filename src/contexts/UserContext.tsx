import { createContext } from "react";
import type { User } from "../models/user";
import type { Account } from "../models/account";

export const UserContext = createContext({
  isLoggedIn: false,
  user: null as User | null,
  account: null as Account | null,
  role: null as string | null,
});
