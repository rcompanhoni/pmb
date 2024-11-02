import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";

const fetchComments = async (postId: string) => {
  const response = await apiClient.get(`/posts/${postId}/comments`);
  return response.data;
};

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId, // the query only runs if postId is defined
  });
};
