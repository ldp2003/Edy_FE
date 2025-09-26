import React from "react";
import type { OrganizationDetailed } from "../../../../../models/organization";

interface OrganizationInfoProps {
  organization: OrganizationDetailed;
}

const OrganizationInfo: React.FC<OrganizationInfoProps> = ({
  organization,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] p-6">
      <h3 className="text-base font-semibold text-[var(--primary-text-color)] mb-4">
        Thông tin
      </h3>

      <div className="space-y-3">
        <div>
          <span className="text-sm text-[var(--secondary-text-color)]">
            Trụ sở chính
          </span>
          <p className="font-medium text-xs text-[var(--primary-text-color)]">
            {organization.address || "Chưa cập nhật"}
          </p>
        </div>

        {organization.website && (
          <div>
            <span className="text-sm text-[var(--secondary-text-color)]">
              Website
            </span>
            <p>
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary-color)] text-xs hover:underline"
              >
                {organization.website}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationInfo;
