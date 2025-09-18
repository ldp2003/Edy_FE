export interface Role {
  _id: string;
  code: RoleCode;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export type RoleCode =
  | "SUPER_ADMIN"
  | "DOCUMENT_ADMIN"
  | "USER_ADMIN"
  | "SYSTEM_ADMIN"
  | "ENTITY_ADMIN"
  | "CUSTOM_ROLE";

export type Permission =
  | "MANAGE_DOCUMENT"
  | "HANDLE_DOCUMENT_REPORT"
  | "MANAGE_USER"
  | "MANAGE_COMMENT"
  | "HANDLE_COMMENT_REPORT"
  | "MANAGE_SERVER"
  | "MANAGE_ENTITY"
  | "MANAGE_ROLE"
  | "ALL";

export interface UserRole {
  role: RoleCode;
  displayName: string;
  description: string;
  icon: string;
  permissions: Permission[];
}
