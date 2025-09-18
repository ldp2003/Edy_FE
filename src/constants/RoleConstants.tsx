/* eslint-disable react-refresh/only-export-components */
import type { RoleCode, Permission, UserRole } from "../models/role";

// eslint-disable-next-line react-refresh/only-export-components
export const ROLE_CODES: Record<string, RoleCode> = {
  SUPER_ADMIN: "SUPER_ADMIN",
  DOCUMENT_ADMIN: "DOCUMENT_ADMIN",
  USER_ADMIN: "USER_ADMIN",
  SYSTEM_ADMIN: "SYSTEM_ADMIN",
  ENTITY_ADMIN: "ENTITY_ADMIN",
  CUSTOM_ROLE: "CUSTOM_ROLE",
} as const;

export const PERMISSIONS: Record<string, Permission> = {
  MANAGE_DOCUMENT: "MANAGE_DOCUMENT",
  HANDLE_DOCUMENT_REPORT: "HANDLE_DOCUMENT_REPORT",
  MANAGE_USER: "MANAGE_USER",
  MANAGE_COMMENT: "MANAGE_COMMENT",
  HANDLE_COMMENT_REPORT: "HANDLE_COMMENT_REPORT",
  MANAGE_SERVER: "MANAGE_SERVER",
  MANAGE_ENTITY: "MANAGE_ENTITY",
  MANAGE_ROLE: "MANAGE_ROLE",
  ALL: "ALL",
} as const;

export const USER_ROLES: UserRole[] = [
  {
    role: "SUPER_ADMIN",
    displayName: "Quản trị viên",
    description: "Quản lý toàn hệ thống",
    icon: "🛡️",
    permissions: ["ALL"],
  },
  {
    role: "DOCUMENT_ADMIN",
    displayName: "Người dùng hệ thống",
    description: "Sử dụng và quản lý tài liệu",
    icon: "📚",
    permissions: ["MANAGE_DOCUMENT", "MANAGE_COMMENT"],
  },
];
