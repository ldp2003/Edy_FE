/* eslint-disable react-refresh/only-export-components */
import type { RoleCode, Permission, UserRole } from "../models/role";

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
    displayName: "Quản lý tài liệu",
    description: "Quản lý tài liệu và bình luận",
    icon: "📚",
    permissions: ["MANAGE_DOCUMENT", "MANAGE_COMMENT"],
  },
  {
    role: "USER_ADMIN",
    displayName: "Quản lý người dùng",
    description: "Quản lý tài khoản người dùng",
    icon: "👥",
    permissions: ["MANAGE_USER"],
  },
  {
    role: "SYSTEM_ADMIN",
    displayName: "Quản trị hệ thống",
    description: "Quản lý máy chủ và hệ thống",
    icon: "⚙️",
    permissions: ["MANAGE_SERVER"],
  },
  {
    role: "ENTITY_ADMIN",
    displayName: "Quản lý thực thể",
    description: "Quản lý các thực thể trong hệ thống",
    icon: "🏢",
    permissions: ["MANAGE_ENTITY"],
  },
  {
    role: "CUSTOM_ROLE",
    displayName: "Vai trò tùy chỉnh",
    description: "Vai trò được tùy chỉnh",
    icon: "🔧",
    permissions: [],
  },
];

// Role mapping for display
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  Admin: "Quản trị viên",
  SUPER_ADMIN: "Quản trị viên hệ thống",
  DOCUMENT_ADMIN: "Quản lý tài liệu",
  USER_ADMIN: "Quản lý người dùng",
  SYSTEM_ADMIN: "Quản trị hệ thống",
  ENTITY_ADMIN: "Quản lý thực thể",
  CUSTOM_ROLE: "Vai trò tùy chỉnh",
};

// Function to get role display name
export const getRoleDisplayName = (roleName: string): string => {
  return ROLE_DISPLAY_NAMES[roleName] || roleName;
};
