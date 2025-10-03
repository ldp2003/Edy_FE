import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../../models/role";
import RoleCard from "./RoleCard";
import { setCookie } from "../../../utils/CookieUtils";

// Simplified roles for role selection
const SIMPLE_ROLES: UserRole[] = [
  {
    role: "SUPER_ADMIN",
    displayName: "Quản trị viên",
    description: "Quản lý và điều hành hệ thống",
    icon: "🛡️",
    permissions: ["ALL"],
  },
  {
    role: "CUSTOM_ROLE",
    displayName: "Người dùng",
    description: "Sử dụng các tính năng của hệ thống",
    icon: "👤",
    permissions: [],
  },
];

const RoleSelectionForm: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      // Lưu chế độ admin vào cookie (boolean)
      const isAdminMode = selectedRole.role === "SUPER_ADMIN";

      // Lưu vào cookie với thời hạn 7 ngày
      setCookie("isAdminMode", isAdminMode.toString(), 7);

      // Chuyển hướng dựa trên role
      if (isAdminMode) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Chọn chế độ sử dụng
          </h1>
          <p className="text-lg text-gray-600">
            Bạn muốn sử dụng hệ thống với vai trò nào?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
          {SIMPLE_ROLES.map((role) => (
            <RoleCard
              key={role.role}
              role={role}
              isSelected={selectedRole?.role === role.role}
              onSelect={handleRoleSelect}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`
              px-10 py-4 rounded-lg font-semibold text-white text-lg transition-all duration-200 min-w-[200px]
              ${
                selectedRole
                  ? "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                  : "bg-gray-300 cursor-not-allowed opacity-50"
              }
            `}
          >
            {selectedRole ? "Tiếp tục" : "Chọn vai trò để tiếp tục"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionForm;
