import React from "react";
import { Modal, Tag, Avatar, Divider, Button } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { Report } from "../../../models/report";
import {
  getReportTypeLabel,
  getReportStatusLabel,
} from "../../../utils/reportTypeUtils";

interface AdminReportDetailModalProps {
  report: Report | null;
  visible: boolean;
  onClose: () => void;
  onResolve?: (report: Report) => void;
}

const AdminReportDetailModal: React.FC<AdminReportDetailModalProps> = ({
  report,
  visible,
  onClose,
  onResolve,
}) => {
  if (!report) return null;

  const handleResolve = () => {
    onResolve?.(report);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      width={600}
      footer={
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Đóng</Button>
          {report.status === "PROCESSING" && onResolve && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleResolve}
            >
              Giải quyết báo cáo
            </Button>
          )}
        </div>
      }
      title={
        <div className="flex items-center gap-2">
          <FileTextOutlined className="text-blue-500" />
          <span className="text-lg font-semibold">Chi tiết báo cáo</span>
          <Tag
            color={report.status === "PROCESSING" ? "blue" : "green"}
            className="ml-2"
          >
            {getReportStatusLabel(report.status)}
          </Tag>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Thông tin tài liệu */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileTextOutlined />
            Thông tin tài liệu
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Tiêu đề:</span>{" "}
              <span className="text-gray-800">
                {typeof report.doc === "object" && report.doc !== null
                  ? report.doc.title
                  : "Không có dữ liệu"}
              </span>
            </div>
            {typeof report.doc === "object" &&
              report.doc !== null &&
              report.doc.author && (
                <div>
                  <span className="font-medium text-gray-600">Tác giả:</span>{" "}
                  <span className="text-gray-800">
                    {report.doc.author.join(", ") || "Không có thông tin"}
                  </span>
                </div>
              )}
          </div>
        </div>

        <Divider className="my-3" />

        {/* Thông tin người báo cáo */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <UserOutlined />
            Người báo cáo
          </h4>
          {typeof report.reporter === "object" && report.reporter !== null ? (
            <div className="flex items-center gap-3">
              <Avatar
                src={report.reporter.avatar}
                size={40}
                icon={<UserOutlined />}
              />
              <div>
                <div className="font-medium text-gray-800">
                  {report.reporter.last_name} {report.reporter.first_name}
                </div>
                <div className="text-xs text-gray-500">
                  ID: {report.reporter._id}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-sm text-gray-400">Không có dữ liệu</span>
          )}
        </div>

        <Divider className="my-3" />

        {/* Chi tiết báo cáo */}
        <div className="space-y-3">
          <div>
            <span className="font-semibold text-gray-700">Loại báo cáo:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {report.type?.map((t) => (
                <Tag key={t} color="red" className="text-xs">
                  {getReportTypeLabel(t)}
                </Tag>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold text-gray-700">Lý do báo cáo:</span>
            <div className="mt-1 p-3 bg-gray-50 rounded border-l-4 border-orange-400">
              <p className="text-sm text-gray-800 leading-relaxed">
                {report.reason}
              </p>
            </div>
          </div>

          {report.resolveReason && (
            <div>
              <span className="font-semibold text-gray-700">
                Lý do giải quyết:
              </span>
              <div className="mt-1 p-3 bg-green-50 rounded border-l-4 border-green-400">
                <p className="text-sm text-gray-800 leading-relaxed">
                  {report.resolveReason}
                </p>
              </div>
            </div>
          )}
        </div>

        <Divider className="my-3" />

        {/* Thông tin thời gian */}
        <div className="flex justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <CalendarOutlined />
            <span>
              Ngày tạo: {new Date(report.createdAt).toLocaleString("vi-VN")}
            </span>
          </div>
          {report.resolvedAt && (
            <div className="flex items-center gap-1">
              <CalendarOutlined />
              <span>
                Ngày giải quyết:{" "}
                {new Date(report.resolvedAt).toLocaleString("vi-VN")}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AdminReportDetailModal;
