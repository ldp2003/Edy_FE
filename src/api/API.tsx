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
      const response = await apiClient.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
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
      const response = await apiClient.post("/auth/logout", {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  },
  refreshToken: async () => {
    try {
      const response = await apiClient.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  },
  getCurrentUser: async () => {
    return apiClient
      .get("/auth/me", { withCredentials: true })
      .then((response) => response.data);
  },
  createOTP: async (
    email: string,
    type: "REGISTER" | "RESET_PASSWORD" | "VERIFY_EMAIL" = "REGISTER"
  ) => {
    try {
      const response = await apiClient.post("/auth/create-otp", {
        email,
        type,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating OTP:", error);
      throw error;
    }
  },
  verifyOTP: async (
    email: string,
    otp: string,
    type: "REGISTER" | "RESET_PASSWORD" | "VERIFY_EMAIL" = "REGISTER"
  ) => {
    try {
      const response = await apiClient.post("/auth/verify-otp", {
        email,
        otp,
        type,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  },
  registerWithOTP: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    otp: string;
  }) => {
    try {
      const response = await apiClient.post("/auth/register-with-otp", data);
      return response.data;
    } catch (error) {
      console.error("Error registering with OTP:", error);
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

  getOrganizations: async (params?: { is_dropdown?: boolean }) => {
    try {
      const response = await apiClient.get("/organizations", { params });
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
  followUser: async (userId: string) => {
    return await apiClient.post(`/users/${userId}/follow`);
  },
  unfollowUser: async (userId: string) => {
    return await apiClient.post(`/users/${userId}/unfollow`);
  },
  getPermissionByUserId: async (userId: string) => {
    return await apiClient.get(`/users/${userId}/roles`);
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
  //Search Subject
  // http://localhost:3000/api/subjects/search?keyword=To%C3%A1n
  searchSubjects: async (keyword: string) => {
    try {
      return await apiClient.get("/subjects/search", { params: { keyword } });
    } catch (error) {
      console.error("Error searching subjects:", error);
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
  // Get all documents (for admin)
  getAllDocuments: async (params: {
    search?: string;
    ordering?: string;
    order?: 1 | -1;
    page?: number;
    limit?: number;
    organization?: string;
    publisher?: string;
    published_year?: number;
    intensive?: boolean;
    author?: string | string[];
    user?: string;
    keyword?: string | string[];
    doc_type?: string;
    level?: string;
    subject?: string;
    status?: string;
    summary_status?: string;
    public_mode?: string;
  }) => {
    try {
      const response = await apiClient.get("/documents", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching all documents:", error);
      throw error;
    }
  },

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
    author?: string | string[];
    user?: string;
    keyword?: string | string[];
    doc_type?: string;
    level?: string;
    subject?: string;
    status?: string;
    summary_status?: string;
    public_mode?: string;
  }) => {
    try {
      const response = await apiClient.get("/documents/newest", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching newest documents:", error);
      throw error;
    }
  },

  addViewCount: async (documentId: string) => {
    return await apiClient.post(`/documents/${documentId}/view`);
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
    public_mode?: string;
    createdAt?: string;
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

  createDownloadLink: async (documentId: string) => {
    try {
      const response = await apiClient.post(
        `/documents/${documentId}/download`
      );
      return response.data;
    } catch (error) {
      console.error("Error creating download link:", error);
      throw error;
    }
  },

  // Download file using link
  downloadFile: async (linkId: string) => {
    try {
      const response = await apiClient.get(`/documents/download/${linkId}`);
      return response;
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  },

  getShareLinks: async (documentId: string) => {
    try {
      const response = await apiClient.get(
        `/documents/${documentId}/share-links`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching share links:", error);
      throw error;
    }
  },

  createShareLink: async (
    documentId: string,
    data: {
      name: string;
      limited_access: number;
      request: boolean;
      time_limited: boolean;
      share_with_organization?: boolean;
      start_date?: string;
      end_date?: string;
    }
  ) => {
    try {
      const response = await apiClient.post(
        `/documents/${documentId}/share-links`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating share link:", error);
      throw error;
    }
  },

  updateShareLinkStatus: async (
    linkId: string,
    status: "ACTIVE" | "INACTIVE" | "DISABLED"
  ) => {
    try {
      const response = await apiClient.patch(
        `/documents/share-links/${linkId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating share link status:", error);
      throw error;
    }
  },

  accessShareLink: async (linkId: string) => {
    try {
      const response = await apiClient.post(
        `/documents/share/${linkId}/access`
      );
      return response.data;
    } catch (error) {
      console.error("Error accessing share link:", error);
      throw error;
    }
  },

  reactDocument: async (
    documentId: string,
    reaction: "LIKE" | "DISLIKE" | "UNREACT"
  ) => {
    try {
      const response = await apiClient.post(`/documents/${documentId}/react`, {
        reaction,
      });
      return response.data;
    } catch (error) {
      console.error("Error reacting to document:", error);
      throw error;
    }
  },

  editDocument: async (
    documentId: string,
    updateData: {
      title?: string;
    }
  ) => {
    try {
      const response = await apiClient.put(
        `/documents/${documentId}/edit`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error editing document:", error);
      throw error;
    }
  },

  getDocumentReactions: async (documentId: string) => {
    try {
      const response = await apiClient.get(
        `/documents/${documentId}/reactions`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching document reactions:", error);
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

  // Update document information
  updateDocument: async (
    documentId: string,
    updateData: {
      title?: string;
      doc_type?: string;
      author?: string[];
      published_year?: number;
      publisher?: string;
      level?: string;
      intensive?: boolean;
      keyword?: string[];
      description?: string;
      page?: number;
    }
  ) => {
    try {
      const response = await apiClient.put(
        `/documents/${documentId}/update`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  },

  updatePublicMode: async (
    documentId: string,
    public_mode: "PUBLIC" | "PRIVATE" | "PRIVATE_SHARED" | "SHARE_ORGANIZATION"
  ) => {
    try {
      const response = await apiClient.patch(
        `/documents/${documentId}/public-mode`,
        { public_mode }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating document public mode:", error);
      throw error;
    }
  },

  // Get similar documents
  getSimilarDocuments: async (documentId: string, limit?: number) => {
    try {
      const params = limit ? { limit } : {};
      const response = await apiClient.get(`/documents/${documentId}/similar`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching similar documents:", error);
      throw error;
    }
  },
  getDocumentByUser: async (
    userId: string,
    params?: {
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
      public_mode?: string;
    }
  ) => {
    return await apiClient.get(`/documents/user/${userId}`, { params });
  },

  // Create or update edit document
  createEditDocument: async (
    documentId: string,
    editData: {
      title?: string;
      doc_type?: string;
      subject?: string;
      author?: string[];
      published_year?: number;
      publisher?: string;
      level?: string;
      keyword?: string[];
      summary_by_user?: string;
      page?: number;
      organization?: string;
      url?: string;
      file_type?: string;
    }
  ) => {
    try {
      const response = await apiClient.post(
        `/documents/${documentId}/edit`,
        editData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating edit document:", error);
      throw error;
    }
  },

  // Update edit document
  updateEditDocument: async (
    editId: string,
    editData: {
      title?: string;
      doc_type?: string;
      subject?: string;
      author?: string[];
      published_year?: number;
      publisher?: string;
      level?: string;
      keyword?: string[];
      summary_by_user?: string;
      page?: number;
      organization?: string;
      url?: string;
      file_type?: string;
    }
  ) => {
    try {
      const response = await apiClient.put(`/documents/edit/${editId}`, editData);
      return response.data;
    } catch (error) {
      console.error("Error updating edit document:", error);
      throw error;
    }
  },

  // Delete edit document
  deleteEditDocument: async (editId: string) => {
    try {
      const response = await apiClient.delete(`/documents/edit/${editId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting edit document:", error);
      throw error;
    }
  },

  // Get edit document by original document
  getEditDocument: async (documentId: string) => {
    try {
      const response = await apiClient.get(`/documents/${documentId}/edit`);
      return response.data;
    } catch (error) {
      console.error("Error fetching edit document:", error);
      throw error;
    }
  },

  // Get edit approval by document ID
  getEditApprovalByDocumentId: async (documentId: string) => {
    try {
      const response = await apiClient.get(`/documents/pending-edit-request/${documentId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching edit approval:", error);
      throw error;
    }
  },

  // Handle edit approval (approve/reject)
  handleEditApproval: async (editApprovalId: string, actionData: {
    action: 'APPROVE' | 'REJECT';
    message?: string;
  }) => {
    try {
      const response = await apiClient.put(`/documents/approve-edit/${editApprovalId}`, actionData);
      return response.data;
    } catch (error) {
      console.error("Error handling edit approval:", error);
      throw error;
    }
  },
};
export const AccessRequestAPI = {
  // Create access request for private share
  createAccessRequest: async (
    privateShareId: string,
    data?: { content?: string }
  ) => {
    try {
      const response = await apiClient.post(
        `/access-requests/private-share/${privateShareId}`,
        data || {}
      );
      return response.data;
    } catch (error) {
      console.error("Error creating access request:", error);
      throw error;
    }
  },

  // Get access requests by private share (owner only)
  getAccessRequestsByPrivateShare: async (
    privateShareId: string,
    params?: {
      status?: string;
      page?: number;
      limit?: number;
      ordering?: string;
      order?: 1 | -1;
    }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append("status", params.status);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.ordering) queryParams.append("ordering", params.ordering);
      if (params?.order) queryParams.append("order", params.order.toString());

      const response = await apiClient.get(
        `/access-requests/private-share/${privateShareId}/list?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching access requests by private share:", error);
      throw error;
    }
  },

  // Approve access request
  approveAccessRequest: async (requestId: string) => {
    try {
      const response = await apiClient.put(
        `/access-requests/${requestId}/approve`
      );
      return response.data;
    } catch (error) {
      console.error("Error approving access request:", error);
      throw error;
    }
  },

  // Deny access request
  denyAccessRequest: async (requestId: string) => {
    try {
      const response = await apiClient.put(
        `/access-requests/${requestId}/deny`
      );
      return response.data;
    } catch (error) {
      console.error("Error denying access request:", error);
      throw error;
    }
  },

  // Get my access requests
  getMyAccessRequests: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    order?: 1 | -1;
  }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.append("status", params.status);
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.ordering) queryParams.append("ordering", params.ordering);
      if (params?.order) queryParams.append("order", params.order.toString());

      const response = await apiClient.get(
        `/access-requests/my-requests?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching my access requests:", error);
      throw error;
    }
  },

  // Cancel access request
  cancelAccessRequest: async (requestId: string) => {
    try {
      const response = await apiClient.delete(
        `/access-requests/${requestId}/cancel`
      );
      return response.data;
    } catch (error) {
      console.error("Error canceling access request:", error);
      throw error;
    }
  },
};

export const CommentAPI = {
  // Tạo bình luận mới cho tài liệu
  createComment: async (
    documentId: string,
    data: { content: string; parentId?: string | null }
  ) => {
    try {
      const response = await apiClient.post(
        `/comments/documents/${documentId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // Lấy danh sách bình luận của tài liệu
  getCommentsByDocument: async (
    documentId: string,
    params?: { page?: number; limit?: number }
  ) => {
    try {
      const response = await apiClient.get(
        `/comments/documents/${documentId}`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching comments by document:", error);
      throw error;
    }
  },

  // Lấy danh sách replies của một bình luận
  getRepliesByComment: async (
    commentId: string,
    params?: { page?: number; limit?: number }
  ) => {
    try {
      const response = await apiClient.get(`/comments/${commentId}/replies`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching replies by comment:", error);
      throw error;
    }
  },

  // Cập nhật nội dung bình luận
  updateComment: async (commentId: string, data: { content: string }) => {
    try {
      const response = await apiClient.put(`/comments/${commentId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  // Xóa bình luận
  deleteComment: async (commentId: string) => {
    try {
      const response = await apiClient.delete(`/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  // Lấy thống kê bình luận của tài liệu
  getCommentStats: async (documentId: string) => {
    try {
      const response = await apiClient.get(
        `/comments/documents/${documentId}/stats`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching comment stats:", error);
      throw error;
    }
  },
};

export const ReportAPI = {
  // Create a new report
  createReport: async (data: {
    docId: string;
    cmtId?: string;
    type: string[];
    reason: string;
  }) => {
    try {
      const response = await apiClient.post("/reports", data);
      return response.data;
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  },

  // Get all reports (admin only)
  getAllReports: async (params?: {
    status?: string;
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await apiClient.get("/reports", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  },

  // Resolve a report (admin only)
  resolveReport: async (
    reportId: string,
    data: {
      validTypes: string[];
      action: string;
      resolveReason: string;
    }
  ) => {
    try {
      const response = await apiClient.put(
        `/reports/${reportId}/resolve`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error resolving report:", error);
      throw error;
    }
  },
};

export const NotificationAPI = {
  // Get user notifications
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
  }) => {
    try {
      const response = await apiClient.get("/notifications", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get("/notifications/unread-count");
      return response.data;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  // Get notification statistics
  getNotificationStats: async () => {
    try {
      const response = await apiClient.get("/notifications/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching notification stats:", error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    try {
      const response = await apiClient.patch(
        `/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await apiClient.patch("/notifications/mark-all-read");
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId: string) => {
    try {
      const response = await apiClient.delete(
        `/notifications/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  // Delete all read notifications
  deleteAllRead: async () => {
    try {
      const response = await apiClient.delete("/notifications/delete-all-read");
      return response.data;
    } catch (error) {
      console.error("Error deleting all read notifications:", error);
      throw error;
    }
  },

  // Create notification (admin only)
  createNotification: async (data: {
    userId: string;
    docId?: string;
    cmtId?: string;
    type: string;
    message: string;
  }) => {
    try {
      const response = await apiClient.post("/notifications/create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },
};

export const RoleAPI = {
  // Get all roles
  getAllRoles: async (active: boolean) => {
    try {
      const response = await apiClient.get("/admin/roles", {
        params: { active },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      throw error;
    }
  },

  // Update role status
  updateRoleStatus: async (roleId: string, isActive: boolean) => {
    try {
      const response = await apiClient.patch(`/admin/roles/${roleId}/status`, {
        is_active: isActive,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating role status:", error);
      throw error;
    }
  },

  // Create role
  createRole: async (data: {
    name: string;
    description: string;
    permissions: string[];
    code: string;
  }) => {
    try {
      const response = await apiClient.post("/admin/roles", data);
      return response.data;
    } catch (error) {
      console.error("Error creating role:", error);
      throw error;
    }
  },

  // Update role
  updateRole: async (
    roleId: string,
    data: {
      name: string;
      description: string;
      permissions: string[];
    }
  ) => {
    try {
      const response = await apiClient.put(`/admin/roles/${roleId}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating role:", error);
      throw error;
    }
  },
};

export const AssignmentAPI = {
  // Get all assignments
  getAllAssignments: async () => {
    try {
      const response = await apiClient.get("/admin/assignments");
      return response.data;
    } catch (error) {
      console.error("Error fetching assignments:", error);
      throw error;
    }
  },

  // Update assignment status
  updateAssignmentStatus: async (assignmentId: string, isActive: boolean) => {
    try {
      const response = await apiClient.patch(
        `/admin/assignments/${assignmentId}/status`,
        {
          is_active: isActive,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating assignment status:", error);
      throw error;
    }
  },

  // Create assignment
  createAssignment: async (data: {
    account_id: string;
    role_id: string;
    organization_id: string;
    subject_id: string;
  }) => {
    try {
      const response = await apiClient.post("/admin/assignments", data);
      return response.data;
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  },

  // Update assignment
  updateAssignment: async (
    assignmentId: string,
    data: {
      account: string;
      role: string;
      organization: string;
      subject: string;
    }
  ) => {
    try {
      const response = await apiClient.put(
        `/admin/assignments/${assignmentId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  },
};

export const PointTransactionAPI = {
  getTransactionHistory: async (
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ) => {
    return await apiClient.get(`/point-transactions/${userId}/history`, {
      params,
    });
  },
};
