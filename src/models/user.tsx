export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  contact_email: string;
  avatar?: string;
  organization?:
    | {
        _id: string;
      }
    | string;
  last_organization_change?: string;
  follower?: string[];
  following?: string[];
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
  shared_documents?: {
    document: string;
    shared_at: string;
  }[];
  favorites?: {
    document: string;
    added_at: string;
  }[];
  status?: "active" | "inactive" | "banned";
  createdAt?: string;
  updatedAt?: string;
}

export const defaultUser: User = {
  _id: "",
  first_name: "",
  last_name: "",
  contact_email: "",
  follower: [],
  following: [],
  field_of_study: [],
  point: 0,
  rank_point: 0,
  strike: 0,
  free_download_count: 0,
  search_history: [],
  read_history: [],
  shared_documents: [],
  favorites: [],
  status: "active",
  createdAt: "",
  updatedAt: "",
  organization: {
    _id: "",
  },
};
