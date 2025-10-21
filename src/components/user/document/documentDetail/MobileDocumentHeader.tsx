import React, { useState, useEffect } from "react";
import {
  School,
  Backpack,
  FolderClosed,
  Download,
  Bookmark,
} from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transform transition-transform duration-300 ${
          isScrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-sm font-medium truncate flex-1 mr-4">
            {document.title}
          </h2>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Download size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bookmark size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Original Header Content */}
      <div className="bg-white shadow-lg text-left">
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <h1 className="text-sm font-bold text-[var(--primary-text-color)] line-clamp-2">
              {document.title}
            </h1>

            <div className="flex items-center gap-2">
              {document.intensive && <IntensiveMark label="Chuyên sâu" />}
            </div>
          </div>

          <div className="flex flex-col gap-3">
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

            <div className="flex flex-col gap-1">
              <div className="flex gap-1 items-center">
                <FolderClosed size={15} />
                <span className="text-sm font-medium">Môn:</span>
              </div>
              <span className="font-bold text-xs text-[var(--primary-color)] line-clamp-1">
                {document.subject?.name}
              </span>
            </div>

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

          <div className="">
            <DocumentDetailActions document={document!} />
          </div>

          <div className="flex justify-start">
            <button
              onClick={() => setShowDescription(true)}
              className="flex items-center gap-1 text-[var(--primary-color)] px-4 py-2 rounded-lg border border-[var(--primary-color)] bg-[var(--primary-color)]10 hover:bg-[var(--primary-color)]20 transition-colors"
            >
              <span>Xem tóm tắt</span>
            </button>
          </div>
        </div>

        {/* Description Modal */}
        {showDescription && (
          <div
            className="fixed inset-0 bg-black/60 bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDescription(false)}
          >
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <Description document={document} isUser={false} />
                <button
                  onClick={() => setShowDescription(false)}
                  className="mt-4 w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MobileDocumentHeader;
