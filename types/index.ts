export interface IUser {
  id: string;
  name: string;
  password: string;
  phone_number?: string;
  email: string;
  nickname: string;
  last_login_at: Date | null;
  session_id: string | null;
  created_at: Date;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  view_count: number;
  created_at: Date;
}

export interface IPostWithAuthor extends IPost {
  author_nickname: string | null;
}

export interface IPaginationParams {
  page: number;
  pageSize: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 