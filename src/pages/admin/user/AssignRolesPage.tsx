import React from "react";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";
import AssignmentTable from "../../../components/admin/role/AssignmentTable";

const AssignRolesPage: React.FC = () => {
  const breadcrumbItems = [
    { label: "Admin", path: "/admin" },
    { label: "Quản lý người dùng", path: "/admin/users" },
    { label: "Phân quyền" },
  ];

  return (
    <div className="h-full">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="mt-4">
        <AssignmentTable />
      </div>
    </div>
  );
};

export default AssignRolesPage;
