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

export const updateComment = async (
  commentId: string,
  comment: Comment,
  token: string,
) => {
  const { data, error } = await supabase
    .from('comments')
    .update(comment)
    .eq('id', commentId)
    .setHeader('Authorization', `Bearer ${token}`)
    .select('*')
    .single();

  if (error) {
    console.error(
      `Error at commentsRepository.updateComment: ${error.message}`,
    );
  }

  return data;
};

export const deleteComment = async (commentId: string, token: string) => {
  const { data, error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .setHeader('Authorization', `Bearer ${token}`)
    .select('*')
    .single();

  if (error) {
    console.error(
      `Error at commentsRepository.deleteComment: ${error.message}`,
    );
  }

  return data;
};
