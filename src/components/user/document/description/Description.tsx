import React, { useState } from "react";
import DescriptionModal from "./DescriptionModal";
import type { Document } from "../../../../models/document";

interface DescriptionProps {
  document: Document;
}

const Description: React.FC<DescriptionProps> = ({ document }) => {
  const [activeTab, setActiveTab] = useState<"original" | "ai">("original");

  return (
    <div className="mt-4">
      <h4 className="font-medium text-sm mb-2">Tóm tắt</h4>
      <div
        style={{ backgroundColor: "var(--field-background-color)" }}
        className="rounded-lg shadow-xl"
      >
        <div className="flex bg-blue-50 rounded-lg p-1 mb-3 ">
          <button
            onClick={() => setActiveTab("original")}
            className={`cursor-pointer flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === "original"
                ? "bg-blue-200 text-[var(--primary-text-color)]"
                : "text-[var(--primary-color)] hover:bg-blue-100"
            }`}
          >
            Bản gốc
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`cursor-pointer flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${
              activeTab === "ai"
                ? "bg-blue-200 text-[var(--primary-text-color)]"
                : "text-[var(--primary-color)] hover:bg-blue-100"
            }`}
          >
            Bản AI
          </button>
        </div>

        <div className="text-[10px] text-gray-600 leading-relaxed">
          {activeTab === "original" ? (
            <p className="p-4">
              {document.description?.summary_by_user ||
                "Chưa có tóm tắt từ người tải lên. Hãy xem tab Bản AI để có thông tin tóm tắt tự động."}
            </p>
          ) : (
            <p className="p-4">
              {document.description?.summary_by_ai ||
                "Tóm tắt AI chưa được tạo cho tài liệu này. Hệ thống sẽ tự động tạo tóm tắt trong thời gian tới."}
            </p>
          )}
        </div>
      </div>

      <DescriptionModal />
    </div>
  );
};

export default Description;
