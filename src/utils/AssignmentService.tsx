import { AssignmentAPI } from "../api/API";

export const AssignmentService = {
  getAllAssignments: async () => {
    try {
      const response = await AssignmentAPI.getAllAssignments();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAssignmentStatus: async (assignmentId: string, isActive: boolean) => {
    try {
      const response = await AssignmentAPI.updateAssignmentStatus(assignmentId, isActive);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createAssignment: async (data: any) => {
    try {
      const response = await AssignmentAPI.createAssignment(data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAssignment: async (assignmentId: string, data: any) => {
    try {
      const response = await AssignmentAPI.updateAssignment(assignmentId, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}
