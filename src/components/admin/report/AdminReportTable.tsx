import React from "react";
import { Table, Avatar, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Report } from "../../../models/report";

interface AdminReportTableProps {
  reports: Report[];
  loading: boolean;
  onRowClick: (report: Report) => void;
}

const AdminReportTable: React.FC<AdminReportTableProps> = ({
  reports,
  loading,
  onRowClick,
}) => {
  const columns: ColumnsType<Report> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_: unknown, __: Report, idx: number) => idx + 1,
    },
    {
      title: "Tài liệu",
      dataIndex: "doc",
      key: "doc",
      render: (doc: string | { title?: string; author?: string[] }) =>
        typeof doc === "object" && doc !== null ? (
          <div className="text-left text-sm">
            <div className="font-medium">{doc.title}</div>
            <div className="text-xs text-gray-500">
              {doc.author?.join(", ")}
            </div>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Không có dữ liệu</span>
        ),
    },
    {
      title: "Người báo cáo",
      dataIndex: "reporter",
      key: "reporter",
      render: (
        reporter:
          | string
          | { avatar?: string; last_name?: string; first_name?: string }
      ) =>
        typeof reporter === "object" && reporter !== null ? (
          <div className="flex items-center gap-2 text-left">
            <Avatar src={reporter.avatar} size={24} />
            <span className="text-sm">
              {reporter.last_name} {reporter.first_name}
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Không có dữ liệu</span>
        ),
    },
    {
      title: "Loại báo cáo",
      dataIndex: "type",
      key: "type",
      render: (types: string[]) => (
        <div className="flex flex-wrap gap-1">
          {types.map((t) => (
            <Tag key={t} color="red" className="text-xs">
              {t}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string) => (
        <span className="text-left text-sm">{reason}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={status === "PROCESSING" ? "blue" : "green"}
          className="text-xs"
        >
          {status}
        </Tag>
      ),
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => (
        <span className="text-xs text-gray-500">
          {new Date(date).toLocaleString("vi-VN")}
        </span>
      ),
    },
  ];

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={reports}
      pagination={false}
      size="middle"
      loading={loading}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
      })}
      className="text-left"
    />
  );
};

export default AdminReportTable;
