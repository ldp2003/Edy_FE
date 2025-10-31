import React from "react";
import { List, Avatar, Checkbox } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import type { Document } from "../../../../models/document";

const getDocumentTypeColor = (docType: string) => {
  const colors = {
    TEXTBOOK: "#1890ff",
    REFERENCE: "#52c41a",
    THESIS: "#722ed1",
    RESEARCH_PAPER: "#fa541c",
    RESEARCH_REPORT: "#fa541c",
    REPORT: "#13c2c2",
    VIDEO: "#f759ab",
    STUDY_GUIDE: "#faad14",
    ESSAY: "#52c41a",
    SOLUTION_SET: "#722ed1",
    LECTURE: "#13c2c2",
    OTHER: "#8c8c8c",
  };
  return colors[docType as keyof typeof colors] || colors.OTHER;
};

const getDocumentTypeLabel = (docType: string) => {
  const labels = {
    RESEARCH_REPORT: "Báo cáo nghiên cứu",
    VIDEO: "Video bài giảng",
    STUDY_GUIDE: "Đề cương học tập",
    TEXTBOOK: "Giáo trình",
    ESSAY: "Tiểu luận",
    SOLUTION_SET: "Bài giải",
    THESIS: "Luận văn",
    LECTURE: "Bài giảng",
    REFERENCE: "Tài liệu tham khảo",
    RESEARCH_PAPER: "Bài báo khoa học",
    REPORT: "Báo cáo",
    OTHER: "Khác",
  };
  return labels[docType as keyof typeof labels] || "Khác";
};

const getFileTypeLabel = (fileType: string) => {
  const labels = {
    WORD: "Word",
    PDF: "PDF",
    EXCEL: "Excel",
    VIDEO: "Video",
    POWERPOINT: "PowerPoint",
  };
  return labels[fileType as keyof typeof labels] || fileType;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

interface CompareDocItemProps {
  document: Document;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: (document: Document) => void;
  onCheckboxChange: (documentId: string, checked: boolean) => void;
}

const CompareDocItem: React.FC<CompareDocItemProps> = React.memo(
  ({ document, isSelected, isChecked, onSelect, onCheckboxChange }) => {
    return (
      <List.Item
        key={document._id}
        className={`transition-colors border-l-4 ${
          isSelected ? "bg-blue-50 border-l-blue-500" : "border-l-transparent"
        }`}
      >
        <div
          className="cursor-pointer hover:bg-gray-50 w-full"
          onClick={() => onSelect(document)}
        >
          <List.Item.Meta
            avatar={
              <Avatar
                size={32}
                icon={<FileTextOutlined />}
                style={{
                  backgroundColor: getDocumentTypeColor(
                    document.doc_type || "OTHER"
                  ),
                  fontSize: "12px",
                }}
              />
            }
            title={
              <div className="pr-4">
                <div className="flex items-center justify-between">
                  <div
                    className="font-medium text-xs text-[var(--primary-text-color)] leading-tight flex-1"
                    title={document.title}
                  >
                    {truncateText(document.title, 50)}
                  </div>
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) =>
                      onCheckboxChange(document._id, e.target.checked)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="ml-2"
                  />
                </div>
                <div
                  className="text-gray-500 mt-1"
                  style={{ fontSize: "10px" }}
                >
                  {getDocumentTypeLabel(document.doc_type || "OTHER")} •{" "}
                  {getFileTypeLabel(document.file_type)} •{" "}
                  {formatDate(document.createdAt)}
                </div>
              </div>
            }
            description={
              <div className="pr-4">
                <div
                  className="text-gray-600"
                  style={{ fontSize: "11px" }}
                  title={`Tác giả: ${
                    document.author?.join(", ") || "Không có"
                  }`}
                >
                  Tác giả:{" "}
                  {truncateText(document.author?.join(", ") || "Không có", 40)}
                </div>
                {document.subject && (
                  <div
                    className="text-gray-500 mt-1"
                    style={{ fontSize: "10px" }}
                    title={`Môn học: ${document.subject.name}`}
                  >
                    Môn học: {truncateText(document.subject.name, 30)}
                  </div>
                )}
              </div>
            }
          />
        </div>
      </List.Item>
    );
  }
);

export default CompareDocItem;
