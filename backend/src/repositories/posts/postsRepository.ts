import { supabase } from '../../config/supabaseClient';
import { Post } from './types';

export const getAllPosts = async (pageSize?: number): Promise<Post[]> => {
  const query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false }); // orders by most recent

  if (pageSize) {
    query.limit(pageSize);
  }

  const { data, error } = await query;
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

export const updatePost = async (id: string, post: Post, token: string) => {
  const { data, error } = await supabase
    .from('posts')
    .update(post)
    .eq('id', id)
    .setHeader('Authorization', `Bearer ${token}`)
    .select('*') // returns the updated post
    .single();

  if (error) {
    console.error(`Error at postsRepository.updatePost: ${error.message}`);
  }

  return data;
};

export const deletePost = async (id: string, token: string) => {
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)
    .setHeader('Authorization', `Bearer ${token}`)
    .select('*')
    .single();

  if (error) {
    console.error(`Error at postsRepository.deletePost: ${error.message}`);
  }

  return data;
};
