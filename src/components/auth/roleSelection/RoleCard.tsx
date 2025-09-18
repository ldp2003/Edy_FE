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
      className={`
        cursor-pointer rounded-lg border-2 transition-all duration-200 p-6 text-center min-h-[200px] flex flex-col justify-center
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:scale-102"
        }
      `}
      onClick={() => onSelect(role)}
    >
      <div className="mb-4 text-6xl">{role.icon}</div>
      <h3
        className={`text-xl font-bold mb-3 ${
          isSelected ? "text-blue-700" : "text-gray-800"
        }`}
      >
        {role.displayName}
      </h3>
      <p
        className={`text-sm leading-relaxed ${
          isSelected ? "text-blue-600" : "text-gray-600"
        }`}
      >
        {role.description}
      </p>
    </div>
  );
};

export default RoleCard;
