
import { apiRequest } from "./api";

export interface Question {
  id: number;
  caseID: number;
  questionText: string;
  answer: string;
  source: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionRequest {
  caseID: number;
  questionText: string;
  answer: string;
  source: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

export const questionService = {
  getQuestions: async (
    page: number = 1,
    pageSize: number = 10,
    sortBy?: string,
    filter?: Record<string, any>
  ): Promise<PaginatedResponse<Question>> => {
    let queryParams = `?page=${page}&pageSize=${pageSize}`;
    
    if (sortBy) {
      queryParams += `&sortBy=${sortBy}`;
    }
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        queryParams += `&${key}=${value}`;
      });
    }
    
    return apiRequest(`/Question${queryParams}`);
  },
  
  createQuestion: async (question: QuestionRequest): Promise<{ questionId: number, message: string }> => {
    return apiRequest("/Question", "POST", question);
  }
};
