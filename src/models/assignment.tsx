export interface Assignment {
  _id: string;
  account: {
    _id: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      fullname: string;
      avatar?: string;
      contact_email: string;
    };
    email: string;
    is_vip: boolean;
    is_admin: boolean;
    is_verified: boolean;
  };
  role: {
    _id: string;
    name: string;
    code: string;
    description?: string;
    is_active: boolean;
  };
  subject?: {
    _id: string;
    name: string;
    code: string;
    description?: string;
  };
  organization?: {
    _id: string;
    name: string;
    code: string;
    description?: string;
  };
  is_active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupedAssignment {
  account: Assignment["account"];
  assignments: Assignment[];
}

export interface CreateAssignmentData {
  account: string;
  role: string;
  subject?: string;
  organization?: string;
}

export interface UpdateAssignmentData {
  role?: string;
  subject?: string;
  organization?: string;
  is_active?: boolean;
}

export interface AssignmentResponse {
  assignments: Assignment[];
  total?: number;
  page?: number;
  totalPages?: number;
}

export const defaultAssignment: Assignment = {
  _id: "",
  account: {
    _id: "",
    user: {
      id: "",
      first_name: "",
      last_name: "",
      fullname: "",
      avatar: "",
      contact_email: "",
    },
    email: "",
    is_vip: false,
    is_admin: false,
    is_verified: false,
  },
  role: {
    _id: "",
    name: "",
    code: "",
    description: "",
    is_active: true,
  },
  subject: undefined,
  organization: undefined,
  is_active: true,
  createdAt: "",
  updatedAt: "",
};
