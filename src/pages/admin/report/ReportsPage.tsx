import React, { useEffect, useState } from "react";
import { Modal, Spin, Table, Tag } from "antd";
import { ReportService } from "../../../utils/ReportService";
import type { Report } from "../../../models/report";
import Avatar from "antd/es/avatar/Avatar";
import type { ColumnsType } from "antd/es/table";

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await ReportService.getAllReports({ page: 1, limit: 20 });
        setReports(res.reports);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

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
    <div className="p-4">
      <h1 className="text-base font-semibold mb-4">Quản lý báo cáo</h1>
      <div className="bg-white p-4 rounded shadow">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={reports}
            pagination={false}
            size="middle"
            onRow={(record) => ({
              onClick: () => {
                setSelectedReport(record);
                setModalVisible(true);
              },
            })}
            className="text-left"
          />
        )}
      </div>
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        title={
          <span className="text-base font-semibold">Chi tiết báo cáo</span>
        }
      >
        {selectedReport && (
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Tài liệu:</span>{" "}
              {typeof selectedReport.doc === "object" &&
              selectedReport.doc !== null
                ? selectedReport.doc.title
                : "Không có dữ liệu"}
            </div>
            <div>
              <span className="font-medium">Người báo cáo:</span>{" "}
              {typeof selectedReport.reporter === "object" &&
              selectedReport.reporter !== null
                ? `${selectedReport.reporter.last_name} ${selectedReport.reporter.first_name}`
                : "Không có dữ liệu"}
            </div>
            <div>
              <span className="font-medium">Loại báo cáo:</span>{" "}
              {selectedReport.type?.join(", ")}
            </div>
            <div>
              <span className="font-medium">Lý do:</span>{" "}
              {selectedReport.reason}
            </div>
            <div>
              <span className="font-medium">Trạng thái:</span>{" "}
              {selectedReport.status}
            </div>
            <div>
              <span className="font-medium">Ngày tạo:</span>{" "}
              {new Date(selectedReport.createdAt).toLocaleString("vi-VN")}
            </div>
            {/* Thêm các trường khác nếu cần */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportsPage;
