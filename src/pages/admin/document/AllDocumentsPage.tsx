import React from "react";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";
import AdminDocumentTable from "../../../components/admin/document/AdminDocumentTable";

const AllDocumentsPage: React.FC = () => {
  const breadcrumbItems = [
    { label: "Tài liệu", path: "/admin" },
    { label: "Tất cả tài liệu" },
  ];

  return (
    <div className="p-6">
      <AdminBreadcrumb items={breadcrumbItems} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-base text-left font-bold text-[var(--primary-text-color)] mb-6">
          Tất cả tài liệu
        </h1>

        <AdminDocumentTable />
      </div>
    </div>
  );
};

export default AllDocumentsPage;
