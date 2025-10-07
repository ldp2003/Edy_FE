/**
 * Utility functions for report type mappings
 */

export const getReportTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    SPAM_OR_MISLEADING: "Spam/Thông tin gây hiểu lầm",
    DUPLICATE: "Trùng lặp",
    COPYRIGHT: "Vi phạm bản quyền",
    INCORRECT_CATEGORY: "Sai danh mục",
    PERSONAL_INFORMATION: "Thông tin cá nhân",
    LOW_QUALITY: "Chất lượng thấp",
    INAPPROPRIATE: "Không phù hợp",
    OTHER: "Khác",
  };
  return typeMap[type] || type;
};

export const getReportStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    PROCESSING: "Đang xử lý",
    RESOLVED: "Đã xử lý",
  };
  return statusMap[status] || status;
};

export const getReportActionLabel = (action: string): string => {
  const actionMap: Record<string, string> = {
    EDIT_REQUESTED: "Yêu cầu chỉnh sửa",
    DELETE: "Xóa",
    FALSE_REPORT: "Báo cáo sai",
  };
  return actionMap[action] || action;
};

// Export all report type options for filters
export const REPORT_TYPE_OPTIONS = [
  { value: "SPAM_OR_MISLEADING", label: "Spam/Thông tin gây hiểu lầm" },
  { value: "DUPLICATE", label: "Trùng lặp" },
  { value: "COPYRIGHT", label: "Vi phạm bản quyền" },
  { value: "INCORRECT_CATEGORY", label: "Sai danh mục" },
  { value: "PERSONAL_INFORMATION", label: "Thông tin cá nhân" },
  { value: "LOW_QUALITY", label: "Chất lượng thấp" },
  { value: "INAPPROPRIATE", label: "Không phù hợp" },
  { value: "OTHER", label: "Khác" },
];

export const REPORT_STATUS_OPTIONS = [
  { value: "PROCESSING", label: "Đang xử lý" },
  { value: "RESOLVED", label: "Đã xử lý" },
];
