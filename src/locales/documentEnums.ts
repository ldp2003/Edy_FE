// Vietnamese translations for document enums
export const documentTypeTranslations = {
  RESEARCH_REPORT: "Báo cáo nghiên cứu khoa học",
  VIDEO: "Video",
  STUDY_GUIDE: "Đề cương ôn tập",
  TEXTBOOK: "Giáo trình",
  ESSAY: "Tiểu luận",
  SOLUTION_SET: "Bài giải",
  THESIS: "Luận văn / Khóa luận",
  LECTURE: "Bài giảng",
  OTHER: "Khác",
};

export const fileTypeTranslations = {
  WORD: "Word",
  PDF: "PDF",
  EXCEL: "Excel",
  VIDEO: "Video",
  POWERPOINT: "PowerPoint",
};

export const levelTranslations = {
  STUDENT: "Học sinh",
  UNIVERSITY: "Sinh viên (ĐH/CĐ)",
  LECTURER: "Giảng viên",
  RESEARCHER: "Nghiên cứu sinh",
  OTHER: "Khác",
};

export const statusTranslations = {
  PENDING: "Đang chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  REQUESTED_EDIT: "Yêu cầu chỉnh sửa",
  PENDING_EDIT: "Chờ chỉnh sửa",
};

export const publicModeTranslations = {
  PUBLIC: "Công khai",
  PRIVATE: "Riêng tư",
  PRIVATE_SHARED: "Chia sẻ riêng tư",
  SHARE_ORGANIZATION: "Chia sẻ tổ chức",
};

// Color mappings for different enums
export const statusColors = {
  PENDING: "#faad14", // Orange
  APPROVED: "#52c41a", // Green
  REJECTED: "#ff4d4f", // Red
  REQUESTED_EDIT: "#722ed1", // Purple
};

export const publicModeColors = {
  PUBLIC: "#52c41a", // Green
  PRIVATE: "#ff4d4f", // Red
  PRIVATE_SHARED: "#fa8c16", // Orange
  SHARE_ORGANIZATION: "#1890ff", // Blue
};

export const levelColors = {
  STUDENT: "#87d068", // Light green
  UNIVERSITY: "#2f54eb", // Blue
  LECTURER: "#722ed1", // Purple
  RESEARCHER: "#eb2f96", // Magenta
  OTHER: "#8c8c8c", // Gray
};

export const fileTypeColors = {
  WORD: "#2f54eb", // Blue
  PDF: "#ff4d4f", // Red
  EXCEL: "#52c41a", // Green
  VIDEO: "#fa541c", // Orange
  POWERPOINT: "#fa8c16", // Orange-yellow
};

export const documentTypeColors = {
  RESEARCH_REPORT: "#1890ff", // Blue
  VIDEO: "#fa541c", // Orange
  STUDY_GUIDE: "#52c41a", // Green
  TEXTBOOK: "#722ed1", // Purple
  ESSAY: "#eb2f96", // Magenta
  SOLUTION_SET: "#13c2c2", // Cyan
  THESIS: "#fa8c16", // Orange-yellow
  LECTURE: "#faad14", // Gold
  OTHER: "#8c8c8c", // Gray
};

// Vietnamese translations for user roles
export const roleTranslations = {
  SUPER_ADMIN: "Quản trị cao cấp", // toàn quyền hệ thống
  REVIEW_ADMIN: "Quản trị duyệt nội dung", // chuyên duyệt tài liệu
  USER_ADMIN: "Quản trị người dùng", // quản lý user
};
