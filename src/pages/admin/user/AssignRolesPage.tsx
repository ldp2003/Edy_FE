import React from "react";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";
import AssignmentTable from "../../../components/admin/role/AssignmentTable";

const AssignRolesPage: React.FC = () => {
  const breadcrumbItems = [
    { label: "Người dùng" },
    { label: "Phân quyền" },
  ];

  return (
    <div className="p-6 h-full">
      <AdminBreadcrumb items={breadcrumbItems} />
      <AssignmentTable />
    </div>
  );
};

export default AssignRolesPage;