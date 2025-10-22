import React, { useState } from "react";
import { Card, Avatar, Tag, Button } from "antd";
import { Eye } from "lucide-react";
import type { Report } from "../../../models/report";
import type { Comment } from "../../../models/comment";
import type { Document } from "../../../models/document";
import DocumentViewModal from "../document/review/DocumentViewModal";

interface ReportCardProps {
  report: Report;
  onResolve?: (report: Report) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onResolve }) => {
  const getReportTypeLabels = (types: string[]) => {
    return types.map((type) => {
      switch (type) {
        case "INAPPROPRIATE":
          return { text: "Nội dung không phù hợp", color: "red" };
        case "COPYRIGHT":
          return { text: "Vi phạm bản quyền", color: "purple" };
        case "SPAM_OR_MISLEADING":
          return { text: "Spam hoặc gây hiểu lầm", color: "orange" };
        case "DUPLICATE":
          return { text: "Nội dung trùng lặp", color: "gold" };
        case "INCORRECT_CATEGORY":
          return { text: "Phân loại sai", color: "blue" };
        case "PERSONAL_INFORMATION":
          return { text: "Chứa thông tin cá nhân", color: "volcano" };
        case "LOW_QUALITY":
          return { text: "Chất lượng kém", color: "magenta" };
        case "OTHER":
          return { text: "Khác", color: "default" };
        default:
          return { text: type, color: "default" };
      }
    });
  };

  const typeLabels = getReportTypeLabels(report.type);
  const reporterObj =
    typeof report.reporter === "object" ? report.reporter : null;
  const reporterName = reporterObj
    ? `${reporterObj.first_name} ${reporterObj.last_name}`
    : "Không xác định";
  const docObj = typeof report.doc === "object" ? report.doc : null;
  const cmtObj = typeof report.cmt === "object" ? report.cmt : null;
  const isCommentReport = cmtObj !== null;

  // Lấy thông tin người đăng/người comment
  const authorInfo =
    isCommentReport && cmtObj
      ? typeof (cmtObj as Comment).user === "object"
        ? (cmtObj as Comment).user
        : null
      : docObj && typeof (docObj as Document).user === "object"
      ? (docObj as Document).user
      : null;
  const authorName = authorInfo
    ? `${authorInfo.first_name} ${authorInfo.last_name}`
    : "Không xác định";

  const [documentViewModalVisible, setDocumentViewModalVisible] =
    useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/public/image/default_cover.png";
  };

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow bg-gray-50">
      <div className="space-y-4 text-left">
        {/* Header - Reporter Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar
              src={reporterObj?.avatar}
              size={40}
              className="border-2 border-white shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-xs font-bold">{reporterName}</span>
                <span className="text-gray-500 text-sm">
                  đã báo cáo{" "}
                  <span className="font-xs font-bold">
                    {isCommentReport ? "bình luận" : "tài liệu"}
                  </span>
                </span>
              </div>
              <div className="text-gray-500 text-sm">
                {new Date(report.createdAt).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
          {report.status === "RESOLVED" && (
            <Tag
              color={
                report.action === "DELETE"
                  ? "red"
                  : report.action === "EDIT_REQUESTED"
                  ? "orange"
                  : "green"
              }
            >
              {report.action === "DELETE"
                ? "Đã xóa"
                : report.action === "EDIT_REQUESTED"
                ? "Yêu cầu chỉnh sửa"
                : "Báo cáo không hợp lệ"}
            </Tag>
          )}
        </div>

        {/* Content */}
        <div className="flex gap-4">
          {/* Cover Image - Chỉ hiển thị khi báo cáo tài liệu */}
          {!isCommentReport && docObj?.cover_page && (
            <div
              className="flex-shrink-0 relative group cursor-pointer"
              onClick={() => setDocumentViewModalVisible(true)}
            >
              <img
                src={docObj.cover_page}
                alt="Document Cover"
                className="w-48 h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
                onError={handleImageError}
              />
              {/* Overlay with view icon */}
              <div className="absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center rounded opacity-0 group-hover:opacity-100">
                <Eye size={24} className="text-white" />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-grow space-y-3">
            {/* Document/Comment Info */}
            <div>
              <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
                {/* Author Info */}
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-1">
                  <Avatar src={authorInfo?.avatar} size={24} />
                  <span
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => {
                      if (authorInfo?._id) {
                        window.location.href = `/user/${authorInfo._id}`;
                      }
                    }}
                  >
                    {authorName}
                  </span>
                </div>
                {/* Content */}
                <div
                  className={`font-xs line-clamp-2 ${
                    !isCommentReport && "font-bold"
                  }`}
                >
                  {isCommentReport
                    ? (cmtObj as Comment)?.content
                    : docObj?.title}
                </div>

                {/* Report Reason */}
                <div className="text-gray-600">
                  <span className="font-xs font-bold">Lý do: </span>
                  {report.reason}
                </div>

                {/* Report Types */}
                <div className="flex flex-wrap gap-2">
                  {typeLabels.map((label, index) => (
                    <Tag key={index} color={label.color}>
                      {label.text}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button
              type="primary"
              onClick={() => onResolve?.(report)}
              className="min-w-[120px]"
              disabled={report.status === "RESOLVED"}
            >
              Xử lý
            </Button>
            <Button
              onClick={() => {
                if (docObj?._id) {
                  window.location.href = `/document-detail/${docObj._id}`;
                }
              }}
              className="min-w-[120px]"
              disabled={report.action === "DELETE" || !docObj?._id}
            >
              Di chuyển đến
            </Button>
          </div>
        </div>
      </div>
      {documentViewModalVisible && docObj && (
        <DocumentViewModal
          document={docObj}
          visible={documentViewModalVisible}
          onClose={() => setDocumentViewModalVisible(false)}
        />
      )}
    </Card>
  );
};

export default ReportCard;
