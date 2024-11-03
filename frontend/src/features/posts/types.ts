export interface Post {
  id: string;
  created_at: string;
  title: string;
  content: string;
  user_id: string;
  hero_image_url: string;
  email: string;
}

export type PostFormData = {
  title: string;
  heroImageUrl: string;
  content: string;
  email?: string;
  postId?: string;
  token?: string;
};
