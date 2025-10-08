import React from "react";
import { Table, Avatar, Tag, Button, Dropdown, Space } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import type { Report } from "../../../models/report";
import {
  getReportTypeLabel,
  getReportStatusLabel,
} from "../../../utils/reportTypeUtils";

interface AdminReportTableProps {
  reports: Report[];
  loading: boolean;
  onRowClick: (report: Report) => void;
  onViewDetail?: (report: Report) => void;
  onResolve?: (report: Report) => void;
  onDelete?: (report: Report) => void;
}

const AdminReportTable: React.FC<AdminReportTableProps> = ({
  reports,
  loading,
  onRowClick,
  onViewDetail,
  onResolve,
  onDelete,
}) => {
  const getActionItems = (record: Report): MenuProps["items"] => [
    {
      key: "view",
      label: "Xem chi tiết",
      icon: <EyeOutlined />,
      onClick: () => onViewDetail?.(record),
    },
    {
      key: "resolve",
      label: record.status === "PROCESSING" ? "Giải quyết" : "Đã giải quyết",
      icon: <EditOutlined />,
      onClick: () => onResolve?.(record),
      disabled: record.status === "RESOLVED",
    },
    {
      key: "delete",
      label: "Xóa báo cáo",
      icon: <DeleteOutlined />,
      onClick: () => onDelete?.(record),
      danger: true,
    },
  ];

  const columns: ColumnsType<Report> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: 60,
      fixed: "left",
      render: (_: unknown, __: Report, idx: number) => idx + 1,
    },
    {
      title: "Tài liệu",
      dataIndex: "doc",
      key: "doc",
      width: 250,
      ellipsis: true,
      render: (doc: string | { title?: string; author?: string[] }) =>
        typeof doc === "object" && doc !== null ? (
          <div className="text-left text-xs">
            <div className="font-medium truncate" title={doc.title}>
              {doc.title}
            </div>
            <div
              className="text-xs text-gray-500 truncate"
              title={doc.author?.join(", ")}
            >
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
      width: 180,
      render: (
        reporter:
          | string
          | { avatar?: string; last_name?: string; first_name?: string }
      ) =>
        typeof reporter === "object" && reporter !== null ? (
          <div className="flex items-center gap-2 text-left">
            <Avatar src={reporter.avatar} size={24} />
            <span className="text-sm truncate">
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
      width: 200,
      render: (types: string[]) => (
        <div className="flex flex-wrap gap-1">
          {types?.slice(0, 2).map((t) => (
            <Tag
              key={t}
              color="red"
              className="text-xs"
              title={getReportTypeLabel(t)}
            >
              {getReportTypeLabel(t)}
            </Tag>
          ))}
          {types?.length > 2 && (
            <Tag className="text-xs">+{types.length - 2}</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 200,
      ellipsis: true,
      render: (reason: string) => (
        <span className="text-left text-xs" title={reason}>
          {reason}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: string) => (
        <Tag
          color={status === "PROCESSING" ? "blue" : "green"}
          className="text-xs"
        >
          {getReportStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => (
        <span className="text-xs text-gray-500">
          {new Date(date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Tác vụ",
      key: "actions",
      width: 100,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail?.(record);
            }}
            title="Xem chi tiết"
          />
          <Dropdown
            menu={{
              items: getActionItems(record),
            }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              onClick={(e) => e.stopPropagation()}
              title="Thêm tác vụ"
            />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={reports}
        pagination={false}
        size="middle"
        loading={loading}
        scroll={{ x: 1300, y: 500 }}
        sticky={{ offsetHeader: 64 }}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          className: "cursor-pointer hover:bg-gray-50",
        })}
        className="text-left"
      />
    </div>
  );
};

export default AdminReportTable;
