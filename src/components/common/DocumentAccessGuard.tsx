import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import type { Document } from "../../models/document";
import { checkDocumentAccess } from "../../utils/DocumentAccessUtils";
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
  onAccessError,
}) => {
  const { user } = useContext(UserContext);
  const [accessError, setAccessError] = useState<DocumentAccessError | null>(
    null
  );

  useEffect(() => {
    if (!loading && document) {
      const accessCheck = checkDocumentAccess(document, user);
      if (!accessCheck.hasAccess && accessCheck.error) {
        setAccessError(accessCheck.error);
        onAccessError?.(accessCheck.error);
      } else {
        setAccessError(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document?._id, user?._id, loading]);

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

  if (!document || accessError) {
    return <DocumentAccessDeniedPage message={accessError?.message} />;
  }

  return <>{children}</>;
};

export default DocumentAccessGuard;
