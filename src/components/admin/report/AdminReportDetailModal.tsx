import React from "react";
import { Modal, Tag } from "antd";
import type { Report } from "../../../models/report";

interface AdminReportDetailModalProps {
  report: Report | null;
  visible: boolean;
  onClose: () => void;
}

const AdminReportDetailModal: React.FC<AdminReportDetailModalProps> = ({
  report,
  visible,
  onClose,
}) => {
  if (!report) return null;
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={<span className="text-base font-semibold">Chi tiết báo cáo</span>}
    >
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Tài liệu:</span>{" "}
          {typeof report.doc === "object" && report.doc !== null
            ? report.doc.title
            : "Không có dữ liệu"}
        </div>
        <div>
          <span className="font-medium">Người báo cáo:</span>{" "}
          {typeof report.reporter === "object" && report.reporter !== null
            ? `${report.reporter.last_name} ${report.reporter.first_name}`
            : "Không có dữ liệu"}
        </div>
        <div>
          <span className="font-medium">Loại báo cáo:</span>{" "}
          {report.type?.map((t) => (
            <Tag key={t} color="red" className="text-xs">
              {t}
            </Tag>
          ))}
        </div>
        <div>
          <span className="font-medium">Lý do:</span> {report.reason}
        </div>
        <div>
          <span className="font-medium">Trạng thái:</span> {report.status}
        </div>
        <div>
          <span className="font-medium">Ngày tạo:</span>{" "}
          {new Date(report.createdAt).toLocaleString("vi-VN")}
        </div>
        {/* Thêm các trường khác nếu cần */}
      </div>
    </Modal>
  );
};

export default AdminReportDetailModal;
