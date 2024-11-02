import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import { PostFormData } from "../models/PostFormData";

const editPost = async ({
  postId,
  token,
  ...data
}: PostFormData & { postId: string; token: string }): Promise<void> => {
  await apiClient.put(`/posts/${postId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useUpdatePost = (): UseMutationResult<
  void, // mutation returns no data
  Error, // type of Error thrown by the mutation
  PostFormData & { postId: string; token: string } // parameter types
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editPost,
    onError: (error: Error) => {
      console.error("Error editing post:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
