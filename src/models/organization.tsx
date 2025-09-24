export interface OrganizationDetailed {
  _id?: string; // Made optional to handle cases where _id is not provided
  name: string;
  code: string;
  description?: string;
  country: string;
  address: string;
  website: string;
  subjects?: {
    subject: string;
    count: number;
  }[];
  content_categories?: {
    doc_type: string;
    document_count: number;
  }[];
  is_deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

