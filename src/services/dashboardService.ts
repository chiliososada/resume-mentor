
import { apiRequest } from "./api";

export interface DashboardData {
  questionStats: {
    total: number;
    recent: number;
    byCategory: Record<string, number>;
  };
  caseStats: {
    total: number;
    upcoming: number;
    completed: number;
  };
  resumeStats: {
    total: number;
    pending: number;
    approved: number;
  };
  userStats: {
    total: number;
    active: number;
  };
}

export const dashboardService = {
  getDashboardData: async (): Promise<DashboardData> => {
    return apiRequest("/Dashboard");
  }
};
