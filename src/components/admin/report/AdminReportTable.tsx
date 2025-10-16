import React from "react";
import { List } from "antd";
import type { Report } from "../../../models/report";
import ReportCard from "./ReportCard";

interface AdminReportTableProps {
  reports: Report[];
  loading: boolean;
  onViewDetail?: (report: Report) => void;
  onResolve?: (report: Report) => void;
  onDelete?: (report: Report) => void;
}

const AdminReportTable: React.FC<AdminReportTableProps> = ({
  reports,
  loading,
  onViewDetail,
  onResolve,
  onDelete,
}) => {
  return (
    <div className="w-[90%] mx-auto space-y-4">
      <List
        loading={loading}
        dataSource={reports}
        renderItem={(report) => (
          <List.Item key={report._id} className="w-full">
            <ReportCard
              report={report}
              onViewDetail={onViewDetail}
              onResolve={onResolve}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default AdminReportTable;
