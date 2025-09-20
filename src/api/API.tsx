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
  getMyDocuments: async () => {
    try {
      const response = await apiClient.get("/documents/my-documents");
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
};
