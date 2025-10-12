import { RoleAPI } from "../api/API";

export const RoleService = {
  getAllRoles: async () => {
    try {
      const response = await RoleAPI.getAllRoles();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateRoleStatus: async (roleId: string, isActive: boolean) => {
    try {
      const response = await RoleAPI.updateRoleStatus(roleId, isActive);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createRole: async (roleData: {
    name: string;
    description: string;
    permissions: string[];
  }) => {
    try {
      const response = await RoleAPI.createRole({
        ...roleData,
        code: "CUSTOM_ROLE"
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateRole: async (roleId: string, roleData: {
    name: string;
    description: string;
    permissions: string[];
  }) => {
    try {
      const response = await RoleAPI.updateRole(roleId, roleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};