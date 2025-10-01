import { SubjectAPI } from "../api/API";
import { storeSubjectMapping, getSubjectIdFromSlug } from "./SlugUtils";
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
      return response;
    } catch (error) {
      console.error("Error in SubjectService.getDocumentsBySubject:", error);
      throw error;
    }
  },

  /**
   * Get subject by slug
   * @param slug - URL slug của môn học
   * @returns Promise<Subject | null>
   */
  async getSubjectBySlug(slug: string): Promise<Subject | null> {
    try {
      // Try to get ID from slug mapping
      const subjectId = getSubjectIdFromSlug(slug);

      if (subjectId) {
        // If we have the ID, fetch the subject directly
        const subject = await this.getSubjectById(subjectId);
        return subject;
      }

      // If not found in mapping, we need to search through subjects
      // This is a fallback - in practice, you might want to call an API that supports search by name
      return null;
    } catch (error) {
      console.error("Error in SubjectService.getSubjectBySlug:", error);
      throw error;
    }
  },
};

export default SubjectService;
