import React, { useState } from "react";
import {
  School,
  ChevronUp,
  ChevronDown,
  Backpack,
  Eye,
  FolderClosed,
  Globe2,
  Lock,
} from "lucide-react";
import { PublicMode, type Document } from "../../../../models/document";
import Comment from "../documentComment/Comment";
import RelatedDocument from "./RelatedDocument";
import DocumentActions from "./DocumentActions";
import IntensiveMark from "../documentElement/IntensiveMark";

const getVisibilityInfo = (publicMode: Document["public_mode"]) => {
  if (
    publicMode === PublicMode.PUBLIC ||
    publicMode === PublicMode.SHARE_ORGANIZATION
  ) {
    return {
      text: "Công khai",
      icon: <Globe2 size={12} />,
      color: "rgb(34, 197, 94)",
      bgColor: "rgba(34, 197, 94, 0.1)",
    };
  }
  return {
    text: "Riêng tư",
    icon: <Lock size={12} />,
    color: "rgb(234, 179, 8)",
    bgColor: "rgba(234, 179, 8, 0.1)",
  };
};

const formatLevel = (level: string) => {
  switch (level) {
    case "beginner":
      return "Cơ bản";
    case "intermediate":
      return "Trung bình";
    case "advanced":
      return "Nâng cao";
    default:
      return "Không xác định";
  }
};

interface MobileDocumentHeaderProps {
  document: Document;
}

const MobileDocumentHeader: React.FC<MobileDocumentHeaderProps> = ({
  document,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const visibilityInfo = getVisibilityInfo(document.public_mode);

  return (
    <div className="bg-white shadow-lg">
      <div className="p-4 space-y-3">
        {/* Tiêu đề và visibility */}
        <div className="space-y-2">
          <h1 className="text-sm font-bold text-[var(--primary-text-color)] line-clamp-2">
            {document.title}
          </h1>

          <div className="flex items-center gap-2">
            {/* Visibility Badge */}
            <div
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                color: visibilityInfo.color,
                backgroundColor: visibilityInfo.bgColor,
              }}
            >
              {visibilityInfo.icon}
              {visibilityInfo.text}
            </div>
            {/* Intensive Badge */}
            {document.intensive && <IntensiveMark label="Chuyên sâu" />}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Tổ chức */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <School size={15} />
              <span className="text-sm font-medium">Thuộc:</span>
            </div>
            <span
              className="font-bold text-xs text-[var(--primary-color)] cursor-pointer line-clamp-1"
              onClick={() => {
                if (document.organization?._id) {
                  window.location.href = `/organization/${document.organization._id}`;
                }
              }}
            >
              {document.organization?.name}
            </span>
          </div>

          {/* Môn học */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <FolderClosed size={15} />
              <span className="text-sm font-medium">Môn:</span>
            </div>
            <span className="font-bold text-xs text-[var(--primary-color)] line-clamp-1">
              {document.subject?.name}
            </span>
          </div>

          {/* Trình độ */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <Backpack size={15} />
              <span className="text-sm font-medium">Trình độ:</span>
            </div>
            <span className="font-bold text-xs text-[var(--primary-color)]">
              {formatLevel(document.level)}
            </span>
          </div>

          {/* Lượt xem */}
          <div className="flex flex-col gap-1">
            <div className="flex gap-1 items-center">
              <Eye size={15} />
              <span className="text-sm font-medium">Lượt xem:</span>
            </div>
            <span className="font-bold text-xs text-[var(--primary-color)]">
              {document.view}
            </span>
          </div>
        </div>

        {/* Document Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <DocumentActions document={document} />
        </div>

        {/* Toggle Info Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-[var(--primary-color)] px-4 py-2 rounded-full border border-[var(--primary-color)] bg-[var(--primary-color)]10 hover:bg-[var(--primary-color)]20 transition-colors"
          >
            <span>{showInfo ? "Ẩn thông tin" : "Xem thêm thông tin"}</span>
            {showInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Info Panel - Slide down */}
      {showInfo && (
        <div className="border-t border-gray-100 animate-in slide-in-from-top duration-200">
          <div className="p-4 space-y-4">
            {/* Mô tả */}
            {document.description && (
              <div className="space-y-2">
                <h3 className="font-semibold text-[var(--primary-text-color)]">
                  Mô tả
                </h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {document.description.summary_by_user ||
                    document.description.summary_by_ai}
                </p>
              </div>
            )}

            {/* Từ khóa */}
            {document.keyword && document.keyword.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-[var(--primary-text-color)]">
                  Từ khóa
                </h3>
                <div className="flex flex-wrap gap-2">
                  {document.keyword.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Thông tin chi tiết */}
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--primary-text-color)]">
                Thông tin chi tiết
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500">Số trang:</p>
                  <p className="font-medium">{document.page}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Định dạng:</p>
                  <p className="font-medium">
                    {document.file_type?.toUpperCase()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Ngày tạo:</p>
                  <p className="font-medium">
                    {new Date(document.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-gray-500">Cập nhật:</p>
                  <p className="font-medium">
                    {document.last_approved_at
                      ? new Date(document.last_approved_at).toLocaleDateString(
                          "vi-VN"
                        )
                      : "Chưa được duyệt"}
                  </p>
                </div>
              </div>
            </div>

            {/* Bình luận */}
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--primary-text-color)]">
                Bình luận
              </h3>
              <Comment documentId={document._id} />
            </div>

            {/* Tài liệu liên quan */}
            <div className="space-y-2">
              <h3 className="font-semibold text-[var(--primary-text-color)]">
                Tài liệu liên quan
              </h3>
              <RelatedDocument doc_id={document._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDocumentHeader;
