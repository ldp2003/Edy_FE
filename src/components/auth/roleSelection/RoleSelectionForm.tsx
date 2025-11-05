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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background:
          "linear-gradient(135deg, var(--secondary-background-color) 0%, var(--third-background-color) 100%)",
      }}
    >
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--primary-text-color)" }}
          >
            Chọn chế độ sử dụng
          </h1>
          <p
            className="text-lg"
            style={{ color: "var(--secondary-text-color)" }}
          >
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
            className="px-10 py-4 rounded-lg font-semibold text-white text-lg transition-all duration-300 min-w-[200px] transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: selectedRole
                ? "var(--primary-color)"
                : "var(--border-color)",
              border: `2px solid ${
                selectedRole ? "var(--primary-color)" : "var(--border-color)"
              }`,
              boxShadow: selectedRole
                ? "0 4px 15px rgba(0, 0, 0, 0.2)"
                : "none",
            }}
          >
            {selectedRole ? "Tiếp tục" : "Chọn vai trò để tiếp tục"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionForm;
