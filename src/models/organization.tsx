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
    subject: string;
    count: number;
  }[];
  content_categories?: {
    doc_type: string;
    document_count: number;
  }[];
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
