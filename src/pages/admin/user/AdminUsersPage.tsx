import React from "react";
import AdminUserTable from "../../../components/admin/user/AdminUserTable";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const AdminUsersPage: React.FC = () => {
  const breadcrumbItems = [
    { label: "Admin", path: "/admin" },
    { label: "Quản lý người dùng", path: "/admin/users" },
    { label: "Tất cả người dùng" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <AdminBreadcrumb items={breadcrumbItems} />
        <div className="mt-4">
          <div className="mt-6">
            <AdminUserTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
