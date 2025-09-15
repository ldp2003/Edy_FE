import { UserAPI } from "../api/API";
import type { User } from "../models/user";

export const verifyUser = async (
  organization: string,
  field_of_study: string
) => {
  try {
    const result = await UserAPI.verifyUser({ organization, field_of_study });
    console.log("User verified successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to verify user:", error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await UserAPI.getUsers();
    console.log("Fetched users:", users);
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};
