import { apiRequest } from "./api";

export interface Case {
  caseID: number;
  caseName: string;
  companyName: string;
  position: string;
  interviewDate: string;
  location: string;
  contactPerson: string;
  contactInfo: string;
  description: string;
  status: number;
  creatorName: string;
  createdAt: string;
  questionCount: number;
}

export interface CaseRequest {
  caseName: string;
  companyName?: string;
  position?: string;
  interviewDate?: string;
  location?: string;
  contactPerson?: string;
  contactInfo?: string;
  description: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

export const caseService = {
  getCases: async (
    page: number = 1,
    pageSize: number = 10,
    sortBy?: string,
    filter?: Record<string, any>
  ): Promise<PaginatedResponse<Case>> => {
    let queryParams = `?PageNumber=${page}&PageSize=${pageSize}`;
    
    if (sortBy) {
      queryParams += `&SortBy=${sortBy}`;
    }
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams += `&${key}=${value}`;
        }
      });
    }
    
    return apiRequest(`/Case${queryParams}`);
  },
  
  getCaseById: async (id: number): Promise<Case> => {
    return apiRequest(`/Case/${id}`);
  },
  
  createCase: async (caseData: CaseRequest): Promise<{ caseId: number, message: string }> => {
    return apiRequest("/Case", "POST", caseData);
  },
  
  updateCase: async (id: number, caseData: Partial<CaseRequest>): Promise<{ message: string }> => {
    return apiRequest(`/Case/${id}`, "PUT", caseData);
  },
  
  deleteCase: async (id: number): Promise<{ message: string }> => {
    return apiRequest(`/Case/${id}`, "DELETE");
  }
};