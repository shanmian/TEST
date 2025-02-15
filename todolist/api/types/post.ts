export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface PostListParams {
  _limit?: number;
  _page?: number;
}

export interface PostCreateParams {
  title: string;
  body: string;
  userId: number;
}