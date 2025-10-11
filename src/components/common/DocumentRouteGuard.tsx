import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { DocumentService } from "../../utils/DocumentService";
import { DocumentStatus } from "../../models/document";
import DocumentAccessGuard from "./DocumentAccessGuard";
import DocumentAccessDeniedPage from "./DocumentAccessDeniedPage";

interface DocumentRouteWrapperProps {
  children: React.ReactNode;
  type: "personal" | "public"; // personal for personal-posts routes, public for document-detail routes
}

const DocumentRouteWrapper: React.FC<DocumentRouteWrapperProps> = ({
  children,
  type,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const [accessDenied, setAccessDenied] = useState<{
    message?: string;
  } | null>(null);

  useEffect(() => {
    const checkAndRoute = async () => {
      if (!id) {
        setLoading(false);
        setShouldRender(true);
        return;
      }

      try {
        setLoading(true);
        const documentData = await DocumentService.getDocumentById(id);
        const isOwner = user && documentData.user._id === user._id;

        if (type === "personal") {
          // Personal posts route - must be owner
          if (!user) {
            setAccessDenied({
              message: "Bạn cần đăng nhập để xem tài liệu cá nhân.",
            });
            setShouldRender(true);
            return;
          }
          if (!isOwner) {
            navigate(`/document-detail/${id}`, { replace: true });
            return;
          }
          setDocument(documentData);
          setShouldRender(true);
        } else {
          // Public document route - if owner, redirect to personal
          if (isOwner) {
            navigate(`/personal-posts/document-detail/${id}`, {
              replace: true,
            });
            return;
          }

          // Kiểm tra trạng thái duyệt - không cho phép truy cập tài liệu chờ duyệt hoặc bị từ chối
          if (
            documentData.status === DocumentStatus.PENDING ||
            documentData.status === DocumentStatus.REJECTED
          ) {
            const message =
              documentData.status === DocumentStatus.PENDING
                ? "Tài liệu đang chờ duyệt và chưa được công bố."
                : "Tài liệu đã bị từ chối duyệt.";
            setAccessDenied({ message });
            setShouldRender(true);
            return;
          }

          setDocument(documentData);
          setShouldRender(true);
        }
      } catch (error) {
        console.error("Error checking document ownership:", error);
        setAccessDenied({
          message: "Không thể tải thông tin tài liệu.",
        });
        setShouldRender(true);
      } finally {
        setLoading(false);
      }
    };

    checkAndRoute();
  }, [id, user, navigate, type]);

  if (!shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Show access denied page if there's an access error
  if (accessDenied) {
    return <DocumentAccessDeniedPage message={accessDenied.message} />;
  }

  // For personal posts, just render children (no additional access check needed)
  if (type === "personal") {
    return <>{children}</>;
  }

  // For public documents, use DocumentAccessGuard for permission checking
  return (
    <DocumentAccessGuard document={document} loading={loading}>
      {children}
    </DocumentAccessGuard>
  );
};

export default DocumentRouteWrapper;
