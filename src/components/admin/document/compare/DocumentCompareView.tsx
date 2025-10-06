import React from "react";
import { Avatar, Tag, Descriptions, Image, Button } from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { Document } from "../../../../models/document";

interface DocumentCompareViewProps {
  document: Document;
}

const DocumentCompareView: React.FC<DocumentCompareViewProps> = ({
  document,
}) => {
  const getDocumentTypeColor = (docType: string) => {
    const colors = {
      TEXTBOOK: "#1890ff",
      REFERENCE: "#52c41a",
      THESIS: "#722ed1",
      RESEARCH_PAPER: "#fa541c",
      REPORT: "#13c2c2",
      OTHER: "#8c8c8c",
    };
    return colors[docType as keyof typeof colors] || colors.OTHER;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      APPROVED: "#52c41a",
      PENDING: "#faad14",
      REJECTED: "#ff4d4f",
      DRAFT: "#d9d9d9",
    };
    return colors[status as keyof typeof colors] || colors.DRAFT;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewDocument = () => {
    if (document.url) {
      window.open(document.url, "_blank");
    }
  };

  const handleDownload = () => {
    if (document.url) {
      const link = window.document.createElement("a");
      link.href = document.url;
      link.download = document.title;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  return (
    <div className="h-full overflow-auto">
      {/* Document Preview */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-4">
          <Avatar
            size={64}
            icon={<FileTextOutlined />}
            style={{
              backgroundColor: getDocumentTypeColor(
                document.doc_type || "OTHER"
              ),
            }}
          />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {document.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Tag color={getDocumentTypeColor(document.doc_type || "OTHER")}>
                {document.doc_type}
              </Tag>
              <Tag color={getStatusColor(document.status || "DRAFT")}>
                {document.status}
              </Tag>
              {document.intensive && (
                <Tag color="#f50">Tài liệu trọng điểm</Tag>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={handleViewDocument}
              >
                Xem
              </Button>
              <Button
                size="small"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
              >
                Tải
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Info */}
      <div className="p-4">
        <Descriptions
          column={1}
          size="small"
          labelStyle={{ fontWeight: 600, color: "#666" }}
        >
          <Descriptions.Item label="Tác giả">
            {document.author?.join(", ") || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Môn học">
            {document.subject?.name || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Tổ chức">
            {document.organization?.name || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Nhà xuất bản">
            {document.publisher || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Năm xuất bản">
            {document.published_year || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Cấp độ">
            {document.level || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Số trang">
            {document.page || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Từ khóa">
            <div className="flex flex-wrap gap-1">
              {document.keyword?.length
                ? document.keyword.map((keyword, index) => (
                    <Tag key={index} color="blue" className="mb-1">
                      {keyword}
                    </Tag>
                  ))
                : "Không có"}
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Chế độ công khai">
            {document.public_mode || "Không có"}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {formatDate(document.createdAt)}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày cập nhật">
            {document.updatedAt ? formatDate(document.updatedAt) : "Không có"}
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* Summary */}
      {document.description?.summary_by_user && (
        <div className="p-4 border-t">
          <h4 className="font-medium text-gray-900 mb-2">Tóm tắt</h4>
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            {document.description.summary_by_user}
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="p-4 border-t">
        <h4 className="font-medium text-gray-900 mb-2">
          Thông tin người tải lên
        </h4>
        <div className="flex items-center gap-3">
          {document.user?.avatar ? (
            <Image
              src={document.user.avatar}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
              preview={false}
            />
          ) : (
            <Avatar size={40}>
              {document.user?.first_name?.charAt(0) || "U"}
            </Avatar>
          )}
          <div>
            <div className="font-medium text-gray-900">
              {document.user?.first_name} {document.user?.last_name}
            </div>
            {document.user?.organization && (
              <div className="text-sm text-gray-500">
                {typeof document.user.organization === "string"
                  ? document.user.organization
                  : document.user.organization.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCompareView;
