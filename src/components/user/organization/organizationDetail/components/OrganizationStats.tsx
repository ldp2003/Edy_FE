import React from "react";
import type { Document } from "../../../../../models/document";

interface OrganizationStatsProps {
  totalDocuments: number;
  documents: Document[];
}

const OrganizationStats: React.FC<OrganizationStatsProps> = ({
  totalDocuments,
  documents,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] p-6 mb-6">
      <h3 className="text-base font-semibold text-[var(--primary-text-color)] mb-4">
        Danh sách tài liệu
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[var(--secondary-text-color)]">
            Tổng tài liệu:
          </span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {totalDocuments.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[var(--secondary-text-color)]">
            Báo cáo nghiên cứu khoa học:
          </span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {
              documents.filter((doc) => doc.doc_type === "RESEARCH_REPORT")
                .length
            }
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[var(--secondary-text-color)]">
            Giáo trình:
          </span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {documents.filter((doc) => doc.doc_type === "TEXTBOOK").length}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[var(--secondary-text-color)]">Bài giảng:</span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {documents.filter((doc) => doc.doc_type === "LECTURE").length}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[var(--secondary-text-color)]">
            Luận văn / Khóa luận:
          </span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {documents.filter((doc) => doc.doc_type === "THESIS").length}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[var(--secondary-text-color)]">Video:</span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {documents.filter((doc) => doc.doc_type === "VIDEO").length}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[var(--secondary-text-color)]">Khác:</span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {documents.filter((doc) => doc.doc_type === "OTHER").length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrganizationStats;
