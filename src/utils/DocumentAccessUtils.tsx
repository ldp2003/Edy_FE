import type { Document } from "../models/document";

interface DocumentAccessError {
  type:
    | "private"
    | "restricted"
    | "not-found"
    | "unauthorized"
    | "pending"
    | "rejected";
  message?: string;
}

// Function to check document access permission
export const checkDocumentAccess = (
  doc: Document,
): { hasAccess: boolean; error?: DocumentAccessError } => {
  // Kiểm tra xem tài liệu có bị xóa không
  if (doc.is_deleted) {
    return {
      hasAccess: false,
      error: {
        type: "not-found",
        message: "Tài liệu đã bị xóa.",
      },
    };
  }

  // BỎ QUA TẤT CẢ KIỂM TRA - CHỈ TIN VÀO API
  // Nếu API trả về document, nghĩa là user có quyền truy cập
  // Backend sẽ xử lý logic phân quyền

  console.log("✅ Skipping all access checks - trusting API response");

  return { hasAccess: true };
};
