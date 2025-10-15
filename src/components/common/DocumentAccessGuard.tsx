import React from "react";
import type { Document } from "../../models/document";
import DocumentAccessDeniedPage from "./DocumentAccessDeniedPage";

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

interface DocumentAccessGuardProps {
  document: Document | null;
  loading: boolean;
  children: React.ReactNode;
  onAccessError?: (error: DocumentAccessError) => void;
}

const DocumentAccessGuard: React.FC<DocumentAccessGuardProps> = ({
  document,
  loading,
  children,
}) => {
  // BỎ QUA TẤT CẢ KIỂM TRA - CHỈ TIN VÀO API
  // Nếu API trả về document, cho phép render

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <DocumentAccessDeniedPage message="Không thể tải thông tin tài liệu." />
    );
  }

  // API đã trả về document → cho phép truy cập
  return <>{children}</>;
};

export default DocumentAccessGuard;
