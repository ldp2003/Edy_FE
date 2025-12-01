import { RoleAPI, UserAPI } from "../api/API";

export const RoleService = {
  getAllRoles: async (
    active: boolean,
    queryParams?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      name?: string;
      code?: string;
      description?: string;
      permissions?: string[];
      is_active?: boolean;
    }
  ) => {
    if (active === undefined) {
      active = true;
    }
    const response = await RoleAPI.getAllRoles(active, queryParams);
    return response.data;
  },

  updateRoleStatus: async (roleId: string, isActive: boolean) => {
    const response = await RoleAPI.updateRoleStatus(roleId, isActive);
    return response.data;
  },

  createRole: async (roleData: {
    name: string;
    description: string;
    permissions: string[];
  }) => {
    const response = await RoleAPI.createRole({
      ...roleData,
      code: "CUSTOM_ROLE",
    });
    return response.data;
  },

  updateRole: async (
    roleId: string,
    roleData: {
      name: string;
      description: string;
      permissions: string[];
    }
  ) => {
    const response = await RoleAPI.updateRole(roleId, roleData);
    return response.data;
  },
  getUserRoles: async (userId: string) => {
    const response = await UserAPI.getPermissionByUserId(userId);
    return response.data;
  },
};
