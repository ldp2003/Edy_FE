// TypeScript interfaces for Subject
import type { User, Organization } from "./user";

export interface Subject {
  _id: string;
  name: string;
  code: string;
  created_by: User;
  organization: Organization;
  description?: string;
  is_checked: boolean;
  checked_by?: User;
  checked_at?: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectsResponse {
  subjects: Subject[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

export interface CreateSubjectData {
  name: string;
  code: string;
  description?: string;
  organization: string;
}

export interface UpdateSubjectData {
  name?: string;
  code?: string;
  description?: string;
  organization?: string;
}

export interface GetSubjectsByOrganizationParams {
  organizationId: string;
}
