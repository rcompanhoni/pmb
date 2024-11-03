export interface Comment {
  id: string;
  created_at: string;
  post_id: string;
  user_id: string;
  content: string;
  email: string;
}

export interface CommentFormData {
  postId: string;
  content: string;
  token: string;
  email: string;
  commentId?: string;
}
