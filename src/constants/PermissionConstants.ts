export const PERMISSIONS = {
  MANAGE_DOCUMENT: 'Quản lý tài liệu',
  HANDLE_REPORT: 'Xử lý báo cáo',
  MANAGE_USER: 'Quản lý người dùng',
  MANAGE_COMMENT: 'Quản lý bình luận',
  MANAGE_SERVER: 'Quản lý máy chủ',
  MANAGE_ENTITY: 'Quản lý thực thể',
  MANAGE_ROLE: 'Quản lý quyền',
  ALL: 'Tất cả quyền'
} as const;

export const PERMISSION_LABELS = {
  [PERMISSIONS.MANAGE_DOCUMENT]: 'Quản lý tài liệu',
  [PERMISSIONS.HANDLE_REPORT]: 'Xử lý báo cáo',
  [PERMISSIONS.MANAGE_USER]: 'Quản lý người dùng',
  [PERMISSIONS.MANAGE_COMMENT]: 'Quản lý bình luận',
  [PERMISSIONS.MANAGE_SERVER]: 'Quản lý máy chủ',
  [PERMISSIONS.MANAGE_ENTITY]: 'Quản lý thực thể',
  [PERMISSIONS.MANAGE_ROLE]: 'Quản lý quyền',
  [PERMISSIONS.ALL]: 'Tất cả quyền'
};