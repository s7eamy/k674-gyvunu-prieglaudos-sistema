// Post type — TypeScript interfaces mirroring the backend Post model
export interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  image_url?: string;
}
