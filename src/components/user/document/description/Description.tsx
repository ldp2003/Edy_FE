import React, { useState } from "react";
import DescriptionModal from "./DescriptionModal";

const Description: React.FC = () => {
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
              Kinh tế chính trị Mác - Lênin nghiên cứu quy luật sinh lý của xã
              hội, nhất là trong chế nghĩa tư bản và con đường đi lên CNXH. Nội
              dung là học thuyết về giá trị thặng dư và bản chất của chế độ tư
              bản chủ nghĩa, về giai cấp vô sản và sứ mệnh lịch sử của CNTB, về
              tổ chức xã hội giai cấp công nhân và những hướng xây dựng nền kinh
              tế CNXH.
            </p>
          ) : (
            <p className="p-4">
              Tài liệu này tổng hợp các khái niệm cốt lõi về kinh tế chính trị
              Mác-Lênin, bao gồm lý thuyết giá trị lao động, thặng dư giá trị,
              và quá trình phát triển của chủ nghĩa tư bản. Nội dung được trình
              bày một cách có hệ thống, phù hợp cho sinh viên đại học nghiên cứu
              về kinh tế chính trị.
            </p>
          )}
        </div>
      </div>

      <DescriptionModal />
    </div>
  );
};

export default Description;
