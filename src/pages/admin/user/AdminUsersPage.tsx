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
      <div className="max-w-[95%] mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <AdminBreadcrumb items={breadcrumbItems} />
        <div className="mt-6">
          <AdminUserTable />
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
