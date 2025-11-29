import React from "react";
import type { Document } from "../../../../models/document";
import DocumentAccessDeniedPage from "../../../../pages/Error/DocumentAccessDeniedPage";
import LoadingScreen from "../../../common/LoadingScreen";

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
    return <LoadingScreen />;
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
