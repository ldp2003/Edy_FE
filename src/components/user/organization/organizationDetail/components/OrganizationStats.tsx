import React from "react";

interface ContentCategory {
  doc_type: string;
  document_count: number;
  _id?: string;
}

interface OrganizationStatsProps {
  totalDocuments: number;
  contentCategories: ContentCategory[];
}

const OrganizationStats: React.FC<OrganizationStatsProps> = ({
  totalDocuments,
  contentCategories,
}) => {
  // Hàm helper để lấy số lượng document theo loại
  const getDocumentCountByType = (docType: string): number => {
    const category = contentCategories.find((cat) => cat.doc_type === docType);
    return category ? category.document_count : 0;
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] p-6">
      <h3 className="text-base font-semibold text-[var(--primary-text-color)] mb-4">
        Danh sách tài liệu
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm border-b pb-2">
          <span className="text-[var(--secondary-text-color)]">
            Tổng tài liệu:
          </span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {totalDocuments.toLocaleString()}
          </span>
        </div>

        <div className="flex text-sm  border-b pb-2 justify-between items-center">
          <span className="text-[var(--secondary-text-color)]">
            Báo cáo nghiên cứu khoa học:
          </span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {getDocumentCountByType("RESEARCH_REPORT").toLocaleString()}
          </span>
        </div>

        <div className="flex text-sm  border-b pb-2 justify-between items-center">
          <span className="text-[var(--secondary-text-color)]">
            Giáo trình:
          </span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {getDocumentCountByType("TEXTBOOK").toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm  border-b pb-2">
          <span className="text-[var(--secondary-text-color)]">Bài giảng:</span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {getDocumentCountByType("LECTURE").toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm  border-b pb-2">
          <span className="text-[var(--secondary-text-color)]">
            Luận văn / Khóa luận:
          </span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {getDocumentCountByType("THESIS").toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center  text-sm  border-b pb-2">
          <span className="text-[var(--secondary-text-color)]">Video:</span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {getDocumentCountByType("VIDEO").toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center  text-sm  border-b pb-2">
          <span className="text-[var(--secondary-text-color)]">Khác:</span>
          <span className="font-semibold text-[var(--primary-text-color)]">
            {getDocumentCountByType("OTHER").toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrganizationStats;
