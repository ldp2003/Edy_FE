import type { Document } from "../models/document";
import type { User } from "../models/user";
import { DocumentStatus, PublicMode } from "../models/document";

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
  currentUser: User | null
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

  // Kiểm tra trạng thái duyệt - chỉ cho phép truy cập tài liệu đã được duyệt
  // Ngoại trừ tác giả có thể xem tài liệu của chính mình
  const isOwner = currentUser && doc.user._id === currentUser._id;
  if (doc.status === DocumentStatus.PENDING && !isOwner) {
    return {
      hasAccess: false,
      error: {
        type: "pending",
        message: "Tài liệu đang chờ duyệt và chưa được công bố.",
      },
    };
  }

  if (doc.status === DocumentStatus.REJECTED && !isOwner) {
    return {
      hasAccess: false,
      error: {
        type: "rejected",
        message: "Tài liệu đã bị từ chối duyệt.",
      },
    };
  } // Kiểm tra public mode
  switch (doc.public_mode) {
    case PublicMode.PRIVATE:
      // Chỉ tác giả mới có thể xem
      if (!currentUser || doc.user._id !== currentUser._id) {
        return {
          hasAccess: false,
          error: {
            type: "private",
            message: "Tài liệu này là riêng tư và không thể truy cập.",
          },
        };
      }
      break;

    case PublicMode.PRIVATE_SHARED:
      // Tác giả và những người được chia sẻ - tạm thời cho phép tất cả user đăng nhập truy cập
      // TODO: Cần thêm logic kiểm tra danh sách người được chia sẻ
      if (!currentUser) {
        return {
          hasAccess: false,
          error: {
            type: "restricted",
            message: "Bạn cần đăng nhập để xem tài liệu này.",
          },
        };
      }
      // Cho phép truy cập nếu đã đăng nhập
      break;

    case PublicMode.SHARE_ORGANIZATION:
      // Chỉ những người trong cùng tổ chức
      if (
        !currentUser ||
        (doc.user._id !== currentUser._id &&
          (!currentUser.organization ||
            (typeof doc.user.organization === "object"
              ? doc.user.organization._id
              : doc.user.organization) !==
              (typeof currentUser.organization === "object"
                ? currentUser.organization._id
                : currentUser.organization)))
      ) {
        return {
          hasAccess: false,
          error: {
            type: "restricted",
            message: "Tài liệu này chỉ dành cho thành viên trong cùng tổ chức.",
          },
        };
      }
      break;

    case PublicMode.PUBLIC:
    default:
      // Công khai - ai cũng có thể xem
      break;
  }

  return { hasAccess: true };
};
