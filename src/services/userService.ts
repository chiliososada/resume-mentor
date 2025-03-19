import { apiRequest } from "./api";

export interface User {
  userID: number;
  username: string;
  email: string;
  userType: number;
  isActive: boolean;
  createdAt?: string;
}

export interface AddUserRequest {
  username: string;
  email: string;
  password: string;
  userType: number;
}

export interface ResetPasswordRequest {
  UserId: number;  // Changed to uppercase 'U' to match backend
  NewPassword: string;  // Changed to uppercase 'N' to match backend
}

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    try {
      return await apiRequest("/User");
    } catch (error) {
      console.error('获取用户列表失败:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    try {
      return await apiRequest(`/User/${id}`);
    } catch (error) {
      console.error(`获取用户ID ${id} 的信息失败:`, error);
      throw error;
    }
  },

  // Add new user
  addUser: async (user: AddUserRequest): Promise<{ userId: string, message: string }> => {
    try {
      // Map to RegisterRequest format as expected by the backend
      const registerRequest = {
        username: user.username,
        password: user.password,
        email: user.email,
        userType: user.userType
      };

      // Use the existing register endpoint
      return await apiRequest("/Auth/register", "POST", registerRequest);
    } catch (error) {
      console.error('添加用户失败:', error);
      throw error;
    }
  },

  // Reset user password
  resetPassword: async (userId: string | number, newPassword: string): Promise<{ message: string }> => {
    try {
      // 检查userId是否存在
      if (!userId) {
        throw new Error('用户ID不能为空');
      }

      // 转换确保userId是数字
      const userIdNumber = typeof userId === 'string' ? parseInt(userId) : userId;

      const resetPasswordRequest: ResetPasswordRequest = {
        UserId: userIdNumber,  // Properly cased to match backend
        NewPassword: newPassword  // Properly cased to match backend
      };

      return await apiRequest("/User/reset-password", "POST", resetPasswordRequest);
    } catch (error) {
      console.error('重置密码失败:', error);
      throw error;
    }
  },

  // Toggle user active status
  toggleUserStatus: async (userId: string, isActive: boolean): Promise<{ message: string }> => {
    try {
      return await apiRequest(`/User/${userId}/status`, "PUT", { isActive });
    } catch (error) {
      console.error('更改用户状态失败:', error);
      throw error;
    }
  },

  // Update user information
  updateUser: async (userId: string, user: Partial<User>): Promise<{ message: string }> => {
    try {
      return await apiRequest(`/User/${userId}`, "PUT", user);
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  }
};