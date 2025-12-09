import type { Document } from "./document";
import type { OrganizationDetailed } from "./organization";

// Export Organization type for backward compatibility
export type Organization = OrganizationDetailed;

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  contact_email: string;
  avatar?: string;
  organization: OrganizationDetailed | string;
  last_organization_change?: string;
  follower?: string[];
  following?: string[];
  doc_count?: number;
  field_of_study?: string[];
  point?: number;
  rank_point?: number;
  strike?: number;
  free_download_count?: number;
  search_history?: {
    keyword: string;
    searched_at: string;
  }[];
  read_history?: {
    document: string;
    read_at: string;
  }[];
  shared_documents: {
    document: string | Document;
    shared_at: string;
    _id?: string;
  }[];
  favorites?: {
    document: string;
    added_at: string;
  }[];
  status?: "ACTIVE" | "INACTIVE" | "BANNED";
  role?: "USER" | "MODERATOR" | "ADMIN"; // Legacy single role
  roles?: string[]; // Array of role codes
  permissions?: string[]; // Mảng các quyền của user
  has_been_vip?: boolean;
  createdAt?: string;
  updatedAt?: string;
  is_admin?: boolean;
}

export const defaultUser: User = {
  _id: "",
  first_name: "Chưa đăng nhập",
  last_name: "",
  contact_email: "",
  follower: [],
  following: [],
  doc_count: 0,
  field_of_study: [],
  point: 0,
  rank_point: 0,
  strike: 0,
  free_download_count: 0,
  search_history: [],
  read_history: [],
  shared_documents: [],
  favorites: [],
  status: "ACTIVE",
  role: "USER",
  has_been_vip: false,
  createdAt: "",
  updatedAt: "",
  organization: {
    _id: "",
    name: "Chưa có trường/tổ chức",
    code: "",
  } as OrganizationDetailed,
};
