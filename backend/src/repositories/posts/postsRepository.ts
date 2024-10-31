import { supabase } from '../../config/supabaseClient';
import { Post } from './types';

export const getAllPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.from('posts').select('*');

  if (error) {
    console.error(`Error at postsRepository.getAllPosts: ${error.message}`);
  }

  return data || [];
};

export const getPostById = async (id: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error at postsRepository.getPostById: ${error.message}`);
  }

  return data;
};

export const createPost = async (post: Post, token: string) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .setHeader('Authorization', `Bearer ${token}`);

  if (error) {
    console.error(`Error at postsRepository.createPost: ${error.message}`);
  }

  return data;
};
