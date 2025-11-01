import React, { useState } from "react";
import DescriptionModal from "./DescriptionModal";
import type { Document } from "../../../../models/document";

interface DescriptionProps {
  document: Document;
  isUser?: boolean;
}

const Description: React.FC<DescriptionProps> = ({
  document,
  isUser = false,
}) => {
  const [activeTab, setActiveTab] = useState<"original" | "ai">("original");
  const [showFullModal, setShowFullModal] = useState(false);

  // Function to check if text exceeds 5 lines
  const shouldShowReadMore = (text: string): boolean => {
    if (!text) return false;
    // Estimate line count based on character count (rough approximation)
    // Assuming average 80 characters per line
    const estimatedLines = Math.ceil(text.length / 80);
    return estimatedLines > 5;
  };

  const getCurrentContent = () => {
    return activeTab === "original"
      ? document.description?.summary_by_user ||
          "Chưa có tóm tắt từ người tải lên. Hãy xem tab Bản AI để có thông tin tóm tắt tự động."
      : document.description?.summary_by_ai ||
          "Tóm tắt AI chưa được tạo cho tài liệu này. Hệ thống sẽ tự động tạo tóm tắt trong thời gian tới.";
  };

  const currentContent = getCurrentContent();
  const showReadMore = shouldShowReadMore(currentContent);

  return (
    <div className="relative">
      <h4 className="font-medium text-base mb-4">Tóm tắt tài liệu</h4>
      <div
        style={{ backgroundColor: "var(--field-background-color)" }}
        className="rounded-lg shadow-sm relative"
      >
        <div className="flex bg-blue-50 rounded-t-lg p-1">
          <button
            onClick={() => setActiveTab("original")}
            className={`cursor-pointer flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "original"
                ? "bg-blue-200 text-[var(--primary-text-color)]"
                : "text-[var(--primary-color)] hover:bg-blue-100"
            }`}
          >
            Bản gốc
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`cursor-pointer flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeTab === "ai"
                ? "bg-blue-200 text-[var(--primary-text-color)]"
                : "text-[var(--primary-color)] hover:bg-blue-100"
            }`}
          >
            Bản AI
          </button>
        </div>
        {!isUser && <DescriptionModal />}

        <div className="text-sm text-gray-700 leading-relaxed relative">
          <div className="p-4">
            <p
              className={`line-clamp-4 ${showReadMore ? "cursor-pointer" : ""}`}
              onClick={showReadMore ? () => setShowFullModal(true) : undefined}
            >
              {currentContent}
            </p>
            {showReadMore && (
              <button
                onClick={() => setShowFullModal(true)}
                className="text-blue-600 hover:text-blue-800 font-medium mt-1"
              >
                Xem thêm
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Full Content Modal */}
      {showFullModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Tóm tắt tài liệu -{" "}
                {activeTab === "original" ? "Bản gốc" : "Bản AI"}
              </h3>
              <button
                onClick={() => setShowFullModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {currentContent}
              </p>
            </div>
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowFullModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Description;
