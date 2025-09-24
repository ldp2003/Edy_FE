import React from "react";
import AdminUserTable from "../../../components/admin/user/AdminUserTable";

const AdminUsersPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản lý người dùng
        </h1>
        <p className="text-gray-600">
          Quản lý danh sách người dùng trong hệ thống
        </p>
      </div>

      <AdminUserTable />
    </div>
  );
};

export default AdminUsersPage;
