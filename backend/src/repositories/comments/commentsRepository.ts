import { supabase } from '../../config/supabaseClient';
import { Comment } from './types';

export const getCommentsByPostId = async (
  postId: string,
): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId);

  if (error) {
    console.error(
      `Error at commentsRepository.getCommentsByPostId: ${error.message}`,
    );
  }

  return data || [];
};

export const createComment = async (comment: Comment, token: string) => {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .setHeader('Authorization', `Bearer ${token}`)
    .select('*')
    .single();

  if (error) {
    console.error(
      `Error at commentsRepository.createComment: ${error.message}`,
    );
  }

  return data;
};
