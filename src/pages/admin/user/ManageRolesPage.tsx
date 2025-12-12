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
    <div className="h-full p-2 md:p-0">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="mt-2 md:mt-4">
        <h1 className="text-base  text-left text-[var(--primary-text-color)] font-bold mb-4">
          Quản lý quyền
        </h1>
        <AdminRoleTable />
      </div>
    </div>
  );
};

export default ManageRolesPage;
