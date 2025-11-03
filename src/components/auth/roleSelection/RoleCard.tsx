import React from "react";
import type { UserRole } from "../../../models/role";

interface RoleCardProps {
  role: UserRole;
  isSelected: boolean;
  onSelect: (role: UserRole) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, isSelected, onSelect }) => {
  return (
    <div
      className="cursor-pointer rounded-xl border-2 transition-all duration-300 p-8 text-center min-h-[250px] flex flex-col justify-center transform hover:scale-105 active:scale-95"
      style={{
        borderColor: isSelected
          ? "var(--primary-color)"
          : "var(--border-color)",
        backgroundColor: isSelected
          ? "var(--field-background-color)"
          : "var(--primary-background-color)",
        boxShadow: isSelected
          ? "0 8px 25px rgba(0, 0, 0, 0.15)"
          : "0 4px 15px rgba(0, 0, 0, 0.1)",
      }}
      onClick={() => onSelect(role)}
    >
      <div className="mb-6 text-7xl animate-pulse">{role.icon}</div>
      <h3
        className="text-2xl font-bold mb-4"
        style={{
          color: isSelected
            ? "var(--primary-color)"
            : "var(--primary-text-color)",
        }}
      >
        {role.displayName}
      </h3>
      <p
        className="text-base leading-relaxed"
        style={{
          color: isSelected
            ? "var(--secondary-text-color)"
            : "var(--third-text-color)",
        }}
      >
        {role.description}
      </p>
    </div>
  );
};

export default RoleCard;
