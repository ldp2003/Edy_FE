import React from "react";
import { Table, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { OrganizationDetailed } from "../../../models/organization";

interface OrganizationTableProps {
  organizations: OrganizationDetailed[];
  loading: boolean;
  onEdit: (organization: OrganizationDetailed) => void;
  onDelete: (organizationId: string) => void;
  onView: (organization: OrganizationDetailed) => void;
}

const OrganizationTable: React.FC<OrganizationTableProps> = ({
  organizations,
  loading,
  onEdit,
  onView,
}) => {
  const columns: ColumnsType<OrganizationDetailed> = [
    {
      title: "STT",
      key: "index",
      className: "text-center text-base sm:text-sm xs:text-xs",
      fixed: "left",
      render: (_, __, index) => (
        <span className="text-base sm:text-sm xs:text-xs font-medium">
          {index + 1}
        </span>
      ),
    },
    {
      title: "Tên tổ chức",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      className: "text-left text-base sm:text-sm xs:text-xs",
      fixed: "left",
      render: (name: string, record: OrganizationDetailed) => (
        <Button
          type="link"
          onClick={() => onView(record)}
          className="text-left text-base sm:text-sm xs:text-xs p-0 h-auto"
        >
          {name}
        </Button>
      ),
    },
    {
      title: "Mã tổ chức",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code.localeCompare(b.code),
      className: "text-left text-base sm:text-sm xs:text-xs",
      responsive: ["md"],
    },
    {
      title: "Quốc gia",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => a.country.localeCompare(b.country),
      className: "text-left text-base sm:text-sm xs:text-xs",
      responsive: ["sm"],
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      ellipsis: true,
      className: "text-left text-base sm:text-sm xs:text-xs",
      responsive: ["lg"],
      render: (website: string) => {
        if (!website) return <span className="text-gray-400">Không có</span>;

        // Ensure website has protocol
        const url = website.startsWith("http") ? website : `https://${website}`;

        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-base sm:text-sm xs:text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {website}
          </a>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "is_checked",
      key: "is_checked",
      className: "text-left text-base sm:text-sm xs:text-xs",
      responsive: ["md"],
      render: (isChecked: boolean) => (
        <span
          className={`${
            isChecked ? "text-green-600" : "text-orange-600"
          } text-base sm:text-sm xs:text-xs`}
        >
          {isChecked ? "Đã duyệt" : "Chưa duyệt"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      className: "text-left text-base sm:text-sm xs:text-xs",
      fixed: "right",
      render: (_, record) => (
        <div className="flex flex-wrap gap-2">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="text-base sm:text-sm xs:text-xs p-0"
          >
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={organizations}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} tổ chức`,
        }}
        className="min-w-full"
      />
    </div>
  );
};

export default OrganizationTable;
