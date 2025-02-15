// 用户相关接口类型定义
// API 响应数据类型定义
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface PostListResponse extends Array<Post> {}

// 保留原有的用户相关类型，以备后续使用
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UserListResponse {
  users: User[];
}

export interface CreateUserParams {
  name: string;
  email: string;
  role: string;
}