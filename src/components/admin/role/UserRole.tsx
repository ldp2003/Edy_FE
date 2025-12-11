import React, { useState, useEffect } from "react";
import { USER_ROLES } from "../../../constants/RoleConstants";
import LoadingScreen from "../../common/LoadingScreen";

const UserRole: React.FC = () => {
  // const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch roles from API
    const fetchRoles = async () => {
      try {
        // Simulate API call
        // console.log("Fetching roles...");
        setTimeout(() => {
          // setRoles([]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý vai trò người dùng</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Các vai trò hệ thống</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {USER_ROLES.map((role) => (
            <div
              key={role.role}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{role.icon}</span>
                <h3 className="font-semibold">{role.displayName}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{role.description}</p>
              <div className="text-xs text-gray-500">
                <strong>Quyền:</strong> {role.permissions.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRole;
