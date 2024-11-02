import { supabase } from '../../config/supabaseClient';
import { Post } from './types';

export const getAllPosts = async (
  pageSize: number,
  page: number,
  search: string,
): Promise<{ posts: Post[]; totalCount: number }> => {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let postsQuery = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  // Apply search filter if search query is provided
  if (search) {
    postsQuery = postsQuery.or(
      `title.ilike.%${search}%,content.ilike.%${search}%`,
    );
  }

  const { data: posts, error: postsError } = await postsQuery;

  // Query for total count without pagination
  let countQuery = supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  if (search) {
    countQuery = countQuery.or(
      `title.ilike.%${search}%,content.ilike.%${search}%`,
    );
  }

  const { count: totalCount, error: countError } = await countQuery;

  if (postsError || countError) {
    console.error(
      `Error at postsRepository.getAllPosts: ${postsError?.message || countError?.message}`,
    );
  }

  return { posts: posts || [], totalCount: totalCount || 0 };
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
