import { createContext } from "react";
import type { User } from "../data/user";
import type { Account } from "../data/account";

export const UserContext = createContext({
  isLoggedIn: false,
  user: null as User | null,
  account: null as Account | null,
});
