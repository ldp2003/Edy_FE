import React from "react";
import AdminRoleTable from "../../../components/admin/role/AdminRoleTable";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const ManageRolesPage: React.FC = () => {
  const breadcrumbItems = [
    { label: "Admin", path: "/admin" },
    { label: "Quản lý người dùng", path: "/admin/users" },
    { label: "Quản lý quyền" },
  ];

  return (
    <div className="h-full">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="mt-4">
        <AdminRoleTable />
      </div>
    </div>
  );
};

export default ManageRolesPage;
