import React from "react";
import AdminRoleTable from "../../../components/admin/role/AdminRoleTable";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const ManageRolesPage: React.FC = () => {
  const breadcrumbItems = [
    { label: "Người dùng" },
    { label: "Quản lý quyền" },
  ];

  return (
    <div className="p-6 h-full">
      <AdminBreadcrumb items={breadcrumbItems} />
      <AdminRoleTable />
    </div>
  );
};

export default ManageRolesPage;