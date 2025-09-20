import { SubjectAPI } from "../api/API";

export interface Subject {
  _id: string;
  name: string;
  code: string;
  description?: string;
  organization: {
    _id: string;
    name: string;
  };
  created_by: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  is_checked: boolean;
  checked_by?: string;
  checked_at?: Date;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubjectData {
  name: string;
  code: string;
  description?: string;
  organization: string;
}

export class SubjectService {
  static async getSubjectsByOrganization(
    organizationId: string
  ): Promise<Subject[]> {
    try {
      const response = await SubjectAPI.getSubjectsByOrganization(
        organizationId
      );
      return response || [];
    } catch (error) {
      console.error(
        "Error in SubjectService.getSubjectsByOrganization:",
        error
      );
      throw error;
    }
  }

  static async createSubject(subjectData: CreateSubjectData): Promise<Subject> {
    try {
      const response = await SubjectAPI.createSubject(subjectData);
      return response.data;
    } catch (error) {
      console.error("Error in SubjectService.createSubject:", error);
      throw error;
    }
  }

  static async getSubjectById(subjectId: string): Promise<Subject> {
    try {
      const response = await SubjectAPI.getSubjectById(subjectId);
      return response.data;
    } catch (error) {
      console.error("Error in SubjectService.getSubjectById:", error);
      throw error;
    }
  }

  static async updateSubject(
    subjectId: string,
    subjectData: Partial<CreateSubjectData>
  ): Promise<Subject> {
    try {
      const response = await SubjectAPI.updateSubject(subjectId, subjectData);
      return response.data;
    } catch (error) {
      console.error("Error in SubjectService.updateSubject:", error);
      throw error;
    }
  }

  static async deleteSubject(subjectId: string): Promise<void> {
    try {
      await SubjectAPI.deleteSubject(subjectId);
    } catch (error) {
      console.error("Error in SubjectService.deleteSubject:", error);
      throw error;
    }
  }
}

export default SubjectService;
