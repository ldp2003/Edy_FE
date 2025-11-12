/* eslint-disable @typescript-eslint/no-explicit-any */
import { AssignmentAPI } from "../api/API";

export const AssignmentService = {
  getAllAssignments: async () => {
    const response = await AssignmentAPI.getAllAssignments();
    return response.data;
  },

  updateAssignmentStatus: async (assignmentId: string, isActive: boolean) => {
    const response = await AssignmentAPI.updateAssignmentStatus(
      assignmentId,
      isActive
    );
    return response.data;
  },

  createAssignment: async (data: any) => {
    const response = await AssignmentAPI.createAssignment(data);
    return response.data;
  },

  updateAssignment: async (assignmentId: string, data: any) => {
    const response = await AssignmentAPI.updateAssignment(assignmentId, data);
    return response.data;
  },

  revokeAllRoles: async (accountId: string) => {
    const response = await AssignmentAPI.revokeAllRoles(accountId);
    return response.data;
  },
};
