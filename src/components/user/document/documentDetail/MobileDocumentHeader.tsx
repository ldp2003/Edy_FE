import React, { useState } from "react";
import { School, Backpack, FolderClosed } from "lucide-react";
import { type Document } from "../../../../models/document";
import IntensiveMark from "../documentElement/IntensiveMark";
import Description from "../description/Description";
import DocumentDetailActions from "./DocumentDetailActions";

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
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="bg-white shadow-lg text-left">
      <div className="p-4 space-y-3">
        {/* Tiêu đề */}
        <div className="space-y-2">
          <h1 className="text-sm font-bold text-[var(--primary-text-color)] line-clamp-2">
            {document.title}
          </h1>

          <div className="flex items-center gap-2">
            {/* Intensive Badge */}
            {document.intensive && <IntensiveMark label="Chuyên sâu" />}
          </div>
        </div>

        {/* Info List */}
        <div className="flex flex-col gap-3">
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
        </div>
        {/* Mobile Actions Bar */}
        <div className="">
          <DocumentDetailActions document={document!} />
        </div>
        {/* Toggle Description Button */}
        <div className="flex justify-start">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center gap-1 text-[var(--primary-color)] px-4 py-2 rounded-lg border border-[var(--primary-color)] bg-[var(--primary-color)]10 hover:bg-[var(--primary-color)]20 transition-colors"
          >
            <span>Xem tóm tắt</span>
          </button>
        </div>
      </div>

      {/* Description Modal */}
      {showDescription && <Description document={document} isUser={false} />}
    </div>
  );
};

export default MobileDocumentHeader;
