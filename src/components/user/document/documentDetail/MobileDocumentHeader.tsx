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
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const scrollTop = target.scrollTop;
      console.log("MobileHeader - Scroll position:", scrollTop); // Debug log

      // Ẩn header bự khi cuộn xuống quá 100px, hiện header gọn
      if (scrollTop > 100) {
        console.log("MobileHeader - Setting isScrolled to true"); // Debug log
        setIsScrolled(true);
      } else {
        console.log("MobileHeader - Setting isScrolled to false"); // Debug log
        setIsScrolled(false);
      }
    };

    // Tìm container cha có overflow-y-auto chứa MobileDocumentHeader này
    const findScrollableParent = (element: HTMLElement): HTMLElement | null => {
      if (!element || element === window.document.body) return null;

      const computedStyle = window.getComputedStyle(element);
      if (
        computedStyle.overflowY === "auto" ||
        computedStyle.overflowY === "scroll"
      ) {
        return element;
      }

      return findScrollableParent(element.parentElement!);
    };

    // Tìm element hiện tại và container scroll cha của nó
    const currentElement = window.document.querySelector(
      ".mobile-document-header"
    ) as HTMLElement;
    let scrollContainer: HTMLElement | null = null;

    console.log("MobileHeader - Current element found:", currentElement); // Debug log

    if (currentElement) {
      scrollContainer = findScrollableParent(currentElement.parentElement!);
      console.log(
        "MobileHeader - Scroll container from parent:",
        scrollContainer
      ); // Debug log
    } else {
      // Fallback: tìm container với class overflow-y-auto trong cùng page
      scrollContainer = window.document.querySelector(
        ".flex-1.overflow-y-auto"
      ) as HTMLElement;
      console.log("MobileHeader - Fallback scroll container:", scrollContainer); // Debug log
    }

    if (scrollContainer) {
      console.log("MobileHeader - Adding scroll listener"); // Debug log
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });

      return () => {
        console.log("MobileHeader - Removing scroll listener"); // Debug log
        scrollContainer!.removeEventListener("scroll", handleScroll);
      };
    } else {
      console.log("MobileHeader - No scroll container found!"); // Debug log
    }
  }, []);

  return (
    <>
      {/* Sticky Header */}
      {isScrolled && (
        <div
          className={`fixed top-14 left-0 right-0 z-40 border-t border-[var(--border-color)] bg-white shadow-md transform transition-transform duration-300`}
        >
          {/* Main header info */}
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

          {/* User info section - always part of header */}
          <div className="px-4 pb-2 border-t border-gray-100">
            <div className="flex items-center gap-2 py-1">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {document.user?.first_name?.[0] || "U"}
                </span>
              </div>
              <span className="text-xs text-gray-600">
                {document.user?.first_name
                  ? `${document.user.first_name} ${
                      document.user.last_name || ""
                    }`
                  : "Người dùng ẩn danh"}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">
                {document.subject?.name || "Chưa có môn học"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Original Header Content */}
      <div className="bg-white shadow-lg text-left mobile-document-header">
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
            className="fixed inset-0 bg-black/60 bg-opacity-50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowDescription(false)}
          >
            <div
              className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
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
