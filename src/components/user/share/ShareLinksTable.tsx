import React from "react";
import { Table, Tag, Tooltip, Button } from "antd";
import { Copy, Lock, Ban, Eye, UserCheck } from "lucide-react";
import type { ShareLinkData } from "./ShareModal";
import dayjs from "dayjs";

interface ShareLinksTableProps {
  shareLinks: ShareLinkData[];
  loading: boolean;
  onCopyLink: (url: string) => void;
  onUpdateStatus: (
    id: string,
    status: "ACTIVE" | "INACTIVE" | "DISABLED"
  ) => void;
  onViewRequests: (id: string) => void;
}

const ShareLinksTable: React.FC<ShareLinksTableProps> = ({
  shareLinks,
  loading,
  onCopyLink,
  onUpdateStatus,
  onViewRequests,
}) => {
  const formatDate = (dateStr: string): string => {
    return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "INACTIVE":
        return "orange";
      case "DISABLED":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "INACTIVE":
        return "Đã khóa";
      case "DISABLED":
        return "Vô hiệu hóa";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "Tên Link",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: ShareLinkData) => (
        <div>
          <span className="font-medium">{text} </span>
          {record.request && (
            <Tag color="blue" className="ml-2" style={{ fontSize: "12px" }}>
              Yêu cầu duyệt
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Người dùng",
      key: "users",
      render: (record: ShareLinkData) => (
        <span className="text-sm">
          {record.access_count}/
          {record.limited_access === 999999 ? "∞" : record.limited_access}
        </span>
      ),
    },
    {
      title: "Thời gian",
      key: "time",
      render: (record: ShareLinkData) => (
        <div className="text-xs text-gray-600">
          {record.time_limited ? (
            <>
              <div>Từ: {formatDate(record.start_date)}</div>
              <div>Đến: {formatDate(record.end_date)}</div>
            </>
          ) : (
            <span className="text-green-600">Không giới hạn</span>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (record: ShareLinkData) => (
        <div className="flex items-center space-x-2">
          {record.status === "ACTIVE" && (
            <>
              <Tooltip title="Sao chép link">
                <Button
                  size="small"
                  icon={<Copy size={12} />}
                  onClick={() => onCopyLink(record.access_url)}
                />
              </Tooltip>
              {record.request && (
                <Tooltip title="Xem yêu cầu truy cập">
                  <Button
                    size="small"
                    icon={<UserCheck size={12} />}
                    onClick={() => onViewRequests(record._id)}
                    className="text-blue-600 hover:text-blue-700"
                  />
                </Tooltip>
              )}
              <Tooltip title="Khóa link">
                <Button
                  size="small"
                  icon={<Lock size={12} />}
                  onClick={() => onUpdateStatus(record._id, "INACTIVE")}
                  className="text-orange-600 hover:text-orange-700"
                  loading={loading}
                />
              </Tooltip>
              <Tooltip title="Vô hiệu hóa">
                <Button
                  size="small"
                  icon={<Ban size={12} />}
                  onClick={() => onUpdateStatus(record._id, "DISABLED")}
                  className="text-red-600 hover:text-red-700"
                  loading={loading}
                />
              </Tooltip>
            </>
          )}

          {record.status === "INACTIVE" && (
            <>
              <Tooltip title="Sao chép link">
                <Button
                  size="small"
                  icon={<Copy size={12} />}
                  onClick={() => onCopyLink(record.access_url)}
                />
              </Tooltip>
              {record.request && (
                <Tooltip title="Xem yêu cầu truy cập">
                  <Button
                    size="small"
                    icon={<UserCheck size={12} />}
                    onClick={() => onViewRequests(record._id)}
                    className="text-blue-600 hover:text-blue-700"
                  />
                </Tooltip>
              )}
              <Tooltip title="Kích hoạt lại">
                <Button
                  size="small"
                  icon={<Eye size={12} />}
                  onClick={() => onUpdateStatus(record._id, "ACTIVE")}
                  className="text-green-600 hover:text-green-700"
                  loading={loading}
                />
              </Tooltip>
              <Tooltip title="Vô hiệu hóa">
                <Button
                  size="small"
                  icon={<Ban size={12} />}
                  onClick={() => onUpdateStatus(record._id, "DISABLED")}
                  className="text-red-600 hover:text-red-700"
                  loading={loading}
                />
              </Tooltip>
            </>
          )}

          {record.status === "DISABLED" && (
            <Tooltip title="Không thể khôi phục">
              <span className="text-xs text-gray-400">Đã vô hiệu hóa</span>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={shareLinks}
      rowKey="_id"
      pagination={false}
      size="small"
      className="mt-4"
      loading={loading}
    />
  );
};

export default ShareLinksTable;
