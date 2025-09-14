export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  contact_email: string;
  follower: string[];
  following: string[];
  field_of_study: string[];
  point: number;
  rank_point: number;
  strike: number;
  free_download_count: number;
  search_history: string[];
  read_history: string[];
  shared_documents: string[];
  favorites: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  organization: {
    _id: string;
  };
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
  status: "",
  createdAt: "",
  updatedAt: "",
  organization: {
    _id: "",
  },
};
