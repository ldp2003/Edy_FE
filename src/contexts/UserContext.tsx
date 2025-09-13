import { createContext } from "react";
import type { User } from "../data/user";

export const UserContext = createContext({
  isLoggedIn: false,
  user: null as User | null,
});
