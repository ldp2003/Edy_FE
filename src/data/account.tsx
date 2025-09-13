export interface Account {
  _id: string;
  user: string;
  email: string;
  is_vip: boolean;
  is_admin: boolean;
  createdAt: string;
  updatedAt: string;
  is_verified: boolean;
}

export const defaultAccount: Account = {
  _id: "",
  user: "",
  email: "",
  is_vip: false,
  is_admin: false,
  createdAt: "",
  updatedAt: "",
  is_verified: false,
};
