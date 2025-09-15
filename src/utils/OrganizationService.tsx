import { OrganizationAPI } from "../api/API";
import type { Organization } from "../models/organization";

export const createOrganization = async (organization: Organization) => {
  try {
    const result = await OrganizationAPI.createOrganization(organization);
    console.log("Organization created successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to create organization:", error);
    throw error;
  }
};

export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await OrganizationAPI.getOrganizations();
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
};
