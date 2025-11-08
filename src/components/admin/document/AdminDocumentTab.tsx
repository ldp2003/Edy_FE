import React from "react";
import { useContext } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { PERMISSIONS } from "../../../constants/PermissionConstants.ts";

const AdminDocumentTab: React.FC = () => {
  const { permissions } = useContext(UserContext);

  // Kiểm tra quyền MANAGE_DOCUMENT
  const hasManageDocumentPermission = permissions.includes(
    PERMISSIONS.MANAGE_DOCUMENT
  );

  // Nếu không có quyền, không hiển thị tab
  if (!hasManageDocumentPermission) {
    return null;
  }

  return (
    <div className="admin-document-tab">
      <h2>Quản lý tài liệu</h2>
      {/* Nội dung tab quản lý tài liệu */}
      <p>
        Đây là tab quản lý tài liệu chỉ hiển thị khi user có quyền
        MANAGE_DOCUMENT.
      </p>
    </div>
  );
};

export default AdminDocumentTab;
