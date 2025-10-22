import React from "react";
import AdminUserTable from "../../../components/admin/user/AdminUserTable";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const AdminUsersPage: React.FC = () => {
  const breadcrumbItems = [
    { label: "Người dùng" },
    { label: "Tất cả người dùng" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdminBreadcrumb items={breadcrumbItems} />
        <div className="mt-6">
          <AdminUserTable />
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
