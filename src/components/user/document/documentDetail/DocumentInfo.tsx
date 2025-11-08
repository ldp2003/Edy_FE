import React from "react";
import {
  Backpack,
  FolderClosed,
  School,
  Globe,
  Lock,
  Users,
  Share,
  Calendar,
} from "lucide-react";
import IntensiveMark from "../documentElement/IntensiveMark";
import type { Document } from "../../../../models/document";
import { useNavigate } from "react-router-dom";

interface DocumentInfoProps {
  document: Document;
}

const DocumentInfo: React.FC<DocumentInfoProps> = ({ document }) => {
  const navigate = useNavigate();

  // Helper function to get visibility info
  const getVisibilityInfo = (mode?: string) => {
    switch (mode) {
      case "PUBLIC":
        return {
          icon: <Globe size={12} />,
          text: "Công khai",
          color: "#52c41a",
          bgColor: "#f6ffed",
        };
      case "PRIVATE":
        return {
          icon: <Lock size={12} />,
          text: "Riêng tư",
          color: "#ff4d4f",
          bgColor: "#fff2f0",
        };
      case "SHARE_ORGANIZATION":
        return {
          icon: <Users size={12} />,
          text: "Chia sẻ tổ chức",
          color: "#1890ff",
          bgColor: "#f0f8ff",
        };
      case "PRIVATE_SHARED":
        return {
          icon: <Share size={12} />,
          text: "Chia sẻ riêng tư",
          color: "#fa8c16",
          bgColor: "#fff7e6",
        };
      default:
        return {
          icon: <Lock size={12} />,
          text: "Riêng tư",
          color: "#8c8c8c",
          bgColor: "#f5f5f5",
        };
    }
  };

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

  const visibilityInfo = getVisibilityInfo(document.public_mode);

  return (
    <div className="space-y-4 text-sm document-info">
      <div className="space-y-2">
        <div className="text-sm line-clamp-1 font-bold text-[var(--primary-text-color)]">
          {document.title}
        </div>

        {/* Hiển thị chế độ công khai */}
        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              color: visibilityInfo.color,
              backgroundColor: visibilityInfo.bgColor,
              border: `1px solid ${visibilityInfo.color}20`,
            }}
          >
            {visibilityInfo.icon}
            {visibilityInfo.text}
          </div>
        </div>
        {document.intensive == true && <IntensiveMark label="Chuyên sâu" />}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1 flex-row items-center">
          <School size={15} />
          <span className="text-sm font-medium">Thuộc:</span>
        </div>
        <span
          className="font-bold text-xs text-[var(--primary-color)] cursor-pointer"
          onClick={() => {
            if (document.organization && document.organization._id) {
              navigate(`/organization/${document.organization._id}`);
            }
          }}
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
          className="font-bold text-xs text-[var(--primary-color)] cursor-pointer"
          onClick={() => {
            if (document.subject && document.subject._id) {
              navigate(`/subject/${document.subject._id}/documents`);
            }
          }}
        >
          {document.subject?.name}
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

      {/* Tác giả */}
      {document.author && document.author.length > 0 && (
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 flex-row items-center">
            <Users size={15} />
            <span className="text-sm font-medium">Tác giả:</span>
          </div>
          <span className="font-bold text-xs text-[var(--primary-text-color)]">
            {document.author.join(", ")}
          </span>
        </div>
      )}

      {/* Năm xuất bản */}
      {document.published_year && (
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 flex-row items-center">
            <Calendar size={15} />
            <span className="text-sm font-medium">Năm xuất bản:</span>
          </div>
          <span className="font-bold text-xs text-[var(--primary-text-color)]">
            {document.published_year}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1 border-y-1 border-gray-200 py-4 text-[var(--secondary-text-color)]">
        <span className="font-bold text-sm">Đăng tải lúc:</span>
        <span className="text-xs">{formatDate(document.createdAt)}</span>
      </div>
    </div>
  );
};

export default DocumentInfo;
