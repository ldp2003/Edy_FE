import React from "react";
import AdminUserTable from "../../../components/admin/user/AdminUserTable";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const AdminUsersPage: React.FC = () => {
  const breadcrumbItems = [
    { label: "Người dùng" },
    { label: "Tất cả người dùng" },
  ];

  return (
    <div className="p-6 h-full">
      <AdminBreadcrumb items={breadcrumbItems} />
      <AdminUserTable />
    </div>
  );
};

export default AdminUsersPage;
