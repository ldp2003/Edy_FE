import React from "react";
import { School } from "lucide-react";
import type { OrganizationDetailed } from "../../../../../models/organization";

interface OrganizationHeaderProps {
  organization: OrganizationDetailed;
}

const OrganizationHeader: React.FC<OrganizationHeaderProps> = ({
  organization,
}) => {
  return (
    <div className="bg-white rounded-lg border border-[var(--border-color)] p-2 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 flex items-center justify-center">
            <School size={32} className="text-[var(--primary-color)]" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-[var(--primary-text-color)] mb-2">
            {organization.name}
          </h1>
          {organization.description && (
            <p className="text-[var(--secondary-text-color)] text-xs">
              {organization.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationHeader;
