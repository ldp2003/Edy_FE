import React from "react";
import { School, Globe, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { OrganizationDetailed } from "../../../../models/organization";

interface OrganizationCardProps {
  organization: OrganizationDetailed;
}

const OrganizationCard: React.FC<OrganizationCardProps> = ({
  organization,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/organization/${organization._id}`);
  };

  return (
    <div
      className="bg-white rounded-lg border border-[var(--border-color)] p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* Header với icon và tiêu đề */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-10 h-10 bg-[var(--primary-color)] rounded">
          <School size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--primary-text-color)] line-clamp-1">
            {organization.name}
          </h3>
          <span className="text-xs text-[var(--secondary-text-color)]">
            {organization.code}
          </span>
        </div>
      </div>

      {/* Mô tả */}
      {organization.description && (
        <p className="text-sm text-[var(--secondary-text-color)] mb-3 line-clamp-2">
          {organization.description}
        </p>
      )}

      {/* Thông tin bổ sung */}
      <div className="space-y-2">
        {organization.address && (
          <div className="flex items-center gap-2 text-xs text-[var(--secondary-text-color)]">
            <MapPin size={12} />
            <span className="truncate">{organization.address}</span>
          </div>
        )}

        {organization.website && (
          <div className="flex items-center gap-2 text-xs text-[var(--primary-color)]">
            <Globe size={12} />
            <span className="truncate hover:underline">Website</span>
          </div>
        )}
      </div>

      {/* Thống kê */}
      <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
        <div className="flex justify-between text-xs">
          <span className="text-[var(--secondary-text-color)]">
            Môn học: {organization.subjects?.length || 0}
          </span>
          <span className="text-[var(--secondary-text-color)]">
            Tài liệu:{" "}
            {organization.content_categories?.reduce(
              (total, cat) => total + cat.document_count,
              0
            ) || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;
