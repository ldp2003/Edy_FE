import React from "react";
import { Backpack, FolderClosed, School } from "lucide-react";
import IntensiveMark from "../documentElement/IntensiveMark";
import type { Document } from "../../../../models/document";

interface DocumentInfoProps {
  document: Document;
}

const DocumentInfo: React.FC<DocumentInfoProps> = ({ document }) => {
  // Helper function to format level
  const formatLevel = (level: string): string => {
    const levelMap: { [key: string]: string } = {
      STUDENT: "Phổ thông",
      UNIVERSITY: "Đại học",
      LECTURER: "Giảng viên",
      RESEARCHER: "Nghiên cứu",
      OTHER: "Khác",
    };
    return levelMap[level] || level;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4 text-sm document-info">
      <div
        className="text-sm font-bold"
        style={{
          color: "var(--secondary-text-color)",
        }}
      >
        {document.title}
      </div>
      {document.intensive && <IntensiveMark label="Chuyên sâu" />}

      <div className="flex flex-col gap-1">
        <div className="flex gap-1 flex-row items-center">
          <School size={15} />
          <span className="text-sm font-medium">Thuộc:</span>
        </div>
        <span
          className="font-bold text-xs"
          style={{ color: "var(--primary-color)" }}
        >
          {document.organization.name}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-1 flex-row items-center">
          <FolderClosed size={15} />
          <span className="text-sm font-medium">Môn:</span>
        </div>
        <span
          className="font-bold text-xs"
          style={{ color: "var(--primary-color)" }}
        >
          {document.subject.name}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-1 flex-row items-center">
          <Backpack size={15} />
          <span className="text-sm font-medium">Trình độ:</span>
        </div>
        <span
          className="font-bold text-xs"
          style={{ color: "var(--primary-color)" }}
        >
          {formatLevel(document.level)}
        </span>
      </div>

      <div
        className="flex flex-col gap-1 border-y-1 border-gray-200 py-4"
        style={{ color: "var(--secondary-text-color)" }}
      >
        <span className="font-bold text-sm">Đăng tải lúc:</span>
        <span className="text-xs">{formatDate(document.createdAt)}</span>
      </div>
    </div>
  );
};

export default DocumentInfo;
