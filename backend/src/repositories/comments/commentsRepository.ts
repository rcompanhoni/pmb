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
