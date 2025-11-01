import React from "react";
import { School } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { OrganizationDetailed } from "../../../../models/organization";

interface OrganizationGridProps {
  organizations: OrganizationDetailed[];
}

const OrganizationGrid: React.FC<OrganizationGridProps> = ({
  organizations,
}) => {
  const navigate = useNavigate();
  if (!organizations || organizations.length === 0) {
    return null;
  }
  return (
    <div className="mb-8 text-left bg-white p-4 rounded-lg border border-[var(--border-color)]">
    
      <div className="grid sm:grid-cols-1 grid-cols-2 gap-4">
        {organizations.map((org) => (
          <div
            key={org._id}
            className="flex items-center gap-1  cursor-pointer"
            onClick={() => navigate(`/organization/${org._id}`)}
          >
            <div className="flex items-center justify-center w-5 h-5">
              <School size={20} className="text-[var(--primary-color)]" />
            </div>
            <span className="font-semibold text-[var(--primary-text-color)] hover:text-[var(--link-color)] text-xs">
              {org.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationGrid;
