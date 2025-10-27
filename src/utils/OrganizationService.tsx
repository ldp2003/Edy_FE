import { OrganizationAPI } from "../api/API";
import type { OrganizationDetailed } from "../models/organization";

export const OrganizationService = {
  createOrganization: async (organization: OrganizationDetailed) => {
    try {
      const result = await OrganizationAPI.createOrganization(organization);
      console.log("Organization created successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to create organization:", error);
      throw error;
    }
  },

  getOrganizations: async (params?: {
    is_dropdown?: boolean;
  }): Promise<OrganizationDetailed[]> => {
    try {
      const response = await OrganizationAPI.getOrganizations(params);
      if (response && Array.isArray(response.organizations)) {
        console.log("Fetched organizations:", response.organizations);
        return response.organizations;
      } else {
        console.error("Unexpected response format:", response);
        throw new Error("API did not return an array of organizations.");
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
      throw error;
    }
  },

  // Method để lấy danh sách tổ chức cho dropdown
  getDropdownOrganizations: async (): Promise<OrganizationDetailed[]> => {
    try {
      return await OrganizationService.getOrganizations({ is_dropdown: true });
    } catch (error) {
      console.error("Failed to fetch dropdown organizations:", error);
      throw error;
    }
  },

  getOrganizationById: async (
    organizationId: string
  ): Promise<OrganizationDetailed> => {
    try {
      const response = await OrganizationAPI.getOrganizationById(
        organizationId
      );
      return response.data || response;
    } catch (error) {
      console.error("Failed to fetch organization by ID:", error);
      throw error;
    }
  },

  updateOrganization: async (
    organizationId: string,
    organizationData: Partial<OrganizationDetailed>
  ): Promise<OrganizationDetailed> => {
    try {
      const response = await OrganizationAPI.updateOrganization(
        organizationId,
        organizationData
      );
      return response.data || response;
    } catch (error) {
      console.error("Failed to update organization:", error);
      throw error;
    }
  },

  deleteOrganization: async (organizationId: string): Promise<void> => {
    try {
      await OrganizationAPI.deleteOrganization(organizationId);
    } catch (error) {
      console.error("Failed to delete organization:", error);
      throw error;
    }
  },
};
