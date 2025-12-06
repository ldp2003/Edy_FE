export type RestrictionType = "POST" | "COMMENT" | "DOWNLOAD" | "LOGIN";

export const RESTRICTION_TYPE_TRANSLATIONS: Record<RestrictionType, string> = {
  POST: "Đăng bài",
  COMMENT: "Bình luận",
  DOWNLOAD: "Tải xuống",
  LOGIN: "Đăng nhập",
};

export interface Restriction {
  _id: string;
  account_id: string;
  restricted_by: string;
  type: RestrictionType;
  reason: string | null;
  startAt: string;
  endAt: string | null;
  status: "ACTIVE" | "DEACTIVATED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}

export const defaultRestriction: Restriction = {
  _id: "",
  account_id: "",
  restricted_by: "",
  type: "POST",
  reason: null,
  startAt: "",
  endAt: null,
  status: "ACTIVE",
  createdAt: "",
  updatedAt: "",
};
