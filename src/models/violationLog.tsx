export type ViolationType =
  | "SPAM_OR_MISLEADING"
  | "DUPLICATE"
  | "COPYRIGHT"
  | "INCORRECT_CATEGORY"
  | "PERSONAL_INFORMATION"
  | "LOW_QUALITY"
  | "INAPPROPRIATE"
  | "OTHER";

export const VIOLATION_TYPE_TRANSLATIONS: Record<ViolationType, string> = {
  SPAM_OR_MISLEADING: "Spam hoặc gây hiểu lầm",
  DUPLICATE: "Trùng lặp",
  COPYRIGHT: "Vi phạm bản quyền",
  INCORRECT_CATEGORY: "Danh mục không đúng",
  PERSONAL_INFORMATION: "Thông tin cá nhân",
  LOW_QUALITY: "Chất lượng thấp",
  INAPPROPRIATE: "Không phù hợp",
  OTHER: "Khác",
};

export interface ViolationLog {
  _id: string;
  user: string;
  doc: string;
  cmt: string | null;
  type: ViolationType[];
  report: string | null;
  strike: number;
  point_reduced: number;
  resolvedBy: string | null;
  reason: string;
  createdAt: string;
}

export const defaultViolationLog: ViolationLog = {
  _id: "",
  user: "",
  doc: "",
  cmt: null,
  type: [],
  report: null,
  strike: 0,
  point_reduced: 0,
  resolvedBy: null,
  reason: "",
  createdAt: "",
};
