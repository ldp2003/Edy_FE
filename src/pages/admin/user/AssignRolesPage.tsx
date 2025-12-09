import React from "react";
import { useLocation } from "react-router-dom";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";
import AssignmentTable from "../../../components/admin/role/AssignmentTable";
import type { User } from "../../../models/user";

const AssignRolesPage: React.FC = () => {
  const location = useLocation();
  const selectedUser = location.state?.selectedUser as User | undefined;

  const breadcrumbItems = [
    { label: "Admin", path: "/admin" },
    { label: "Quản lý người dùng", path: "/admin/users" },
    { label: "Phân quyền" },
  ];

  return (
    <div className="h-full p-2 md:p-0">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="mt-2 md:mt-4">
        <AssignmentTable selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default AssignRolesPage;
