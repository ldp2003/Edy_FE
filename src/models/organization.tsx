/* eslint-disable @typescript-eslint/no-explicit-any */
import type { User } from "./user";

export interface OrganizationDetailed {
  _id?: string; // Made optional to handle cases where _id is not provided
  name: string;
  code: string;
  description?: string;
  country: string;
  address: string;
  website: string;
  logo?: string;
  subjects?: {
    subject: {
      _id: string;
      name: string;
    };
    count: number;
    _id: string;
  }[];
  content_categories?: {
    doc_type: string;
    document_count: number;
    _id: string;
  }[];
  users?: {
    _id: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    rank_point: number;
    strike: number;
    doc_count: number;
    is_vip: boolean;
    roles: any[];
  }[];
  user_count?: number;
  created_by?: User;
  is_checked?: boolean;
  checked_by?: User;
  checked_at?: string;
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrganizationsResponse {
  organizations: OrganizationDetailed[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

export interface CreateOrganizationData {
  name: string;
  code: string;
  description?: string;
  country: string;
  address: string;
  website: string;
  logo?: string;
}

export interface UpdateOrganizationData {
  name?: string;
  code?: string;
  description?: string;
  country?: string;
  address?: string;
  website?: string;
  logo?: string;
}
