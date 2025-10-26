import { SubjectAPI } from "../api/API";
import { storeSubjectMapping } from "./SlugUtils";
import type {
  Subject,
  CreateSubjectData,
  UpdateSubjectData,
} from "../models/subject";

const SubjectService = {
  /**
   * Get subjects by organization ID
   * @param organizationId - ID của tổ chức
   * @returns Promise<Subject[]>
   */
  async getSubjectsByOrganization(organizationId: string): Promise<Subject[]> {
    try {
      const response = await SubjectAPI.getSubjectsByOrganization(
        organizationId
      );
      const subjects = response || [];

      // Store slug mappings for all subjects
      subjects.forEach((subject: Subject) => {
        storeSubjectMapping(subject.name, subject._id);
      });

      return subjects;
    } catch (error) {
      console.error(
        "Error in SubjectService.getSubjectsByOrganization:",
        error
      );
      throw error;
    }
  },

  /**
   * Create a new subject
   * @param subjectData - Dữ liệu môn học mới
   * @returns Promise<Subject>
   */
  async createSubject(subjectData: CreateSubjectData): Promise<Subject> {
    try {
      const response = await SubjectAPI.createSubject(subjectData);
      return response.data || response;
    } catch (error) {
      console.error("Error in SubjectService.createSubject:", error);
      throw error;
    }
  },

  async searchSubjects(keyword: string): Promise<Subject[]> {
    try {
      const response = await SubjectAPI.searchSubjects(keyword);
      const subjects = response.data || [];
      return subjects;
    } catch (error) {
      console.error("Error in SubjectService.searchSubjects:", error);
      throw error;
    }
  },

  /**
   * Get subject by ID
   * @param subjectId - ID của môn học
   * @returns Promise<Subject>
   */
  async getSubjectById(subjectId: string): Promise<Subject> {
    try {
      const response = await SubjectAPI.getSubjectById(subjectId);
      return response.data || response;
    } catch (error) {
      console.error("Error in SubjectService.getSubjectById:", error);
      throw error;
    }
  },

  /**
   * Update subject
   * @param subjectId - ID của môn học
   * @param subjectData - Dữ liệu cập nhật
   * @returns Promise<Subject>
   */
  async updateSubject(
    subjectId: string,
    subjectData: UpdateSubjectData
  ): Promise<Subject> {
    try {
      const response = await SubjectAPI.updateSubject(subjectId, subjectData);
      return response.data || response;
    } catch (error) {
      console.error("Error in SubjectService.updateSubject:", error);
      throw error;
    }
  },

  /**
   * Delete subject
   * @param subjectId - ID của môn học
   * @returns Promise<void>
   */
  async deleteSubject(subjectId: string): Promise<void> {
    try {
      await SubjectAPI.deleteSubject(subjectId);
    } catch (error) {
      console.error("Error in SubjectService.deleteSubject:", error);
      throw error;
    }
  },

  /**
   * Get documents by subject
   * @param subjectId - ID của môn học
   * @returns Promise<unknown>
   */
  async getDocumentsBySubject(subjectId: string): Promise<unknown> {
    try {
      const response = await SubjectAPI.getDocumentsBySubject(subjectId);
      console.log("SubjectService.getDocumentsBySubject response:", response);
      return response;
    } catch (error) {
      console.error("Error in SubjectService.getDocumentsBySubject:", error);
      throw error;
    }
  },

  /**
   * Sync subject document count
   * @param subjectId - ID của môn học
   * @returns Promise<{message: string, old_count?: number, new_count?: number, count?: number}>
   */
  async syncSubjectDocCount(
    subjectId: string
  ): Promise<{
    message: string;
    old_count?: number;
    new_count?: number;
    count?: number;
  }> {
    try {
      const response = await SubjectAPI.syncSubjectDocCount(subjectId);
      return response;
    } catch (error) {
      console.error("Error in SubjectService.syncSubjectDocCount:", error);
      throw error;
    }
  },

  /**
   * Sync all subjects document count
   * @returns Promise<{message: string, total_subjects: number, updated_subjects: number, updated_list: {subject_id: string, old_count: number, new_count: number}[]}>
   */
  async syncAllSubjectsDocCount(): Promise<{
    message: string;
    total_subjects: number;
    updated_subjects: number;
    updated_list: {
      subject_id: string;
      old_count: number;
      new_count: number;
    }[];
  }> {
    try {
      const response = await SubjectAPI.syncAllSubjectsDocCount();
      return response;
    } catch (error) {
      console.error("Error in SubjectService.syncAllSubjectsDocCount:", error);
      throw error;
    }
  },
};

export default SubjectService;
