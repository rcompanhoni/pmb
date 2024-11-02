import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import { Post } from "../models/Post";

const fetchPost = async (postId: string) => {
  const response = await apiClient.get(`/posts/${postId}`);
  return response.data;
};

export const usePost = (postId: string) => {
  return useQuery<Post>({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId, // only runs if postId is defined
  });
};
