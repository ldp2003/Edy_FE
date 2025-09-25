import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent with requests
});

export const AuthAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      // Re-throw the error to preserve the original error structure
      throw error;
    }
  },
  register: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await apiClient.post("/auth/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  },
  logout: async () => {
    try {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },
  refreshToken: async () => {
    try {
      const response = await apiClient.post("/auth/refresh-token");
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },
};

export const OrganizationAPI = {
  createOrganization: async (organization: {
    name: string;
    code: string;
    description?: string;
    country: string;
    address: string;
    website: string;
  }) => {
    try {
      const response = await apiClient.post("/organizations", organization);
      return response.data;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  },

  getOrganizations: async () => {
    try {
      const response = await apiClient.get("/organizations");
      return response.data;
    } catch (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
  },
};

export const UserAPI = {
  verifyUser: async (data: {
    organization: string;
    field_of_study: string;
  }) => {
    try {
      const response = await apiClient.put("/users/verify", data);
      return response.data;
    } catch (error) {
      console.error("Error verifying user:", error);
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },

  updateUserStatus: async (userId: string, status: string) => {
    try {
      const response = await apiClient.put(`/users/${userId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

  updateUser: async (
    userId: string,
    userData: {
      first_name?: string;
      last_name?: string;
      contact_email?: string;
      organization?: string;
      field_of_study?: string[];
      status?: string;
      avatar?: string;
    }
  ) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  updateProfile: async (data: {
    first_name?: string;
    last_name?: string;
    organization?: string;
    avatar?: string;
  }) => {
    try {
      const response = await apiClient.put("/users/profile", data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
  }) => {
    try {
      const response = await apiClient.put("/users/change-password", data);
      return response.data;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  getListFavorites: async () => {
    try {
      const response = await apiClient.get("/users/favorites");
      return response.data;
    } catch (error) {
      console.error("Error fetching favorite documents:", error);
      throw error;
    }
  },

  addToFavorites: async (documentId: string) => {
    try {
      const response = await apiClient.post(`/users/favorites/${documentId}`);
      return response.data;
    } catch (error) {
      console.error("Error adding document to favorites:", error);
      throw error;
    }
  },

  removeFromFavorites: async (documentId: string) => {
    try {
      const response = await apiClient.delete(`/users/favorites/${documentId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing document from favorites:", error);
      throw error;
    }
  },
};

export const SubjectAPI = {
  // Get subjects by organization
  getSubjectsByOrganization: async (organizationId: string) => {
    try {
      const response = await apiClient.get("/subjects", {
        params: { organizationId },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching subjects by organization:", error);
      throw error;
    }
  },

  // Create new subject
  createSubject: async (subjectData: {
    name: string;
    code: string;
    description?: string;
    organization: string;
  }) => {
    try {
      const response = await apiClient.post("/subjects", subjectData);
      return response.data;
    } catch (error) {
      console.error("Error creating subject:", error);
      throw error;
    }
  },

  // Get subject by ID
  getSubjectById: async (subjectId: string) => {
    try {
      const response = await apiClient.get(`/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching subject by ID:", error);
      throw error;
    }
  },

  // Update subject
  updateSubject: async (
    subjectId: string,
    subjectData: {
      name?: string;
      code?: string;
      description?: string;
      organization?: string;
    }
  ) => {
    try {
      const response = await apiClient.put(
        `/subjects/${subjectId}`,
        subjectData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  },

  // Delete subject
  deleteSubject: async (subjectId: string) => {
    try {
      const response = await apiClient.delete(`/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
    }
  },

  // Get documents by subject
  getDocumentsBySubject: async (subjectId: string) => {
    try {
      const response = await apiClient.get(`/subjects/${subjectId}/documents`);
      return response.data;
    } catch (error) {
      console.error("Error fetching documents by subject:", error);
      throw error;
    }
  },
};

export const DocumentAPI = {
  // Fetch newest documents
  fetchNewestDocuments: async (params: {
    search?: string;
    ordering?: string;
    order?: 1 | -1;
    page?: number;
    limit?: number;
    organization?: string;
    publisher?: string;
    published_year?: number;
    intensive?: boolean;
    author?: string;
    user?: string;
    keyword?: string;
    doc_type?: string;
    level?: string;
    subject?: string;
  }) => {
    try {
      const response = await apiClient.get("/documents/newest", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching newest documents:", error);
      throw error;
    }
  },
  // Get documents of current user
  getMyDocuments: async (params?: {
    search?: string;
    ordering?: string;
    order?: 1 | -1;
    page?: number;
    limit?: number;
    organization?: string;
    publisher?: string;
    published_year?: number;
    intensive?: boolean;
    author?: string;
    keyword?: string;
    doc_type?: string;
    level?: string;
    subject?: string;
    status?: string;
  }) => {
    try {
      const response = await apiClient.get("/documents/my-documents", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching my documents:", error);
      throw error;
    }
  },

  // Upload a new document
  uploadDocument: async (documentData: {
    url: string;
    title: string;
    doc_type: string;
    file_type: string;
    subject: string;
    author: string[];
    published_year?: number;
    publisher?: string;
    organization?: string;
    level: string;
    intensive?: boolean;
    keyword?: string[];
    description?: string;
    page?: number;
    cover_page?: string;
  }) => {
    try {
      const response = await apiClient.post("/documents", documentData);
      return response.data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },

  // Get document by ID
  getDocumentById: async (documentId: string) => {
    try {
      const response = await apiClient.get(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching document by ID:", error);
      throw error;
    }
  },

  // Approve a document
  approveDocument: async (documentId: string) => {
    try {
      const response = await apiClient.put(`/documents/approve/${documentId}`);
      return response.data;
    } catch (error) {
      console.error("Error approving document:", error);
      throw error;
    }
  },

  // Reject a document
  rejectDocument: async (documentId: string, reason?: string) => {
    try {
      const response = await apiClient.put(`/documents/reject/${documentId}`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error rejecting document:", error);
      throw error;
    }
  },

  // Request edit for a document
  requestEditDocument: async (documentId: string, reason?: string) => {
    try {
      const response = await apiClient.put(
        `/documents/request-edit/${documentId}`,
        {
          reason,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error requesting edit for document:", error);
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (documentId: string, reason?: string) => {
    try {
      const response = await apiClient.delete(`/documents/${documentId}`, {
        data: { reason },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  // Get pending documents (for admin)
  getPendingDocuments: async (params?: {
    page?: number;
    limit?: number;
    ordering?: string;
    order?: 1 | -1;
  }) => {
    try {
      const response = await apiClient.get("/documents/pending", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching pending documents:", error);
      throw error;
    }
  },

  // Get pending requests by document ID
  getPendingRequests: async (documentId: string) => {
    try {
      const response = await apiClient.get(
        `/documents/pending-requests/${documentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting pending requests:", error);
      throw error;
    }
  },

  // Approve document by request ID
  approveDocumentByRequestId: async (
    requestId: string,
    data?: {
      isIntensive?: boolean;
    }
  ) => {
    try {
      const response = await apiClient.put(
        `/documents/approve/${requestId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error approving document request:", error);
      throw error;
    }
  },
  // Reject document by request ID
  rejectDocumentByRequestId: async (requestId: string, reason: string) => {
    try {
      const response = await apiClient.put(`/documents/reject/${requestId}`, {
        message: reason,
      });
      return response.data;
    } catch (error) {
      console.error("Error rejecting document request:", error);
      throw error;
    }
  },
};
