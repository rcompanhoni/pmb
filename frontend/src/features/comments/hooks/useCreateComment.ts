import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import { CommentFormData } from "../types";

const createComment = async ({
  postId,
  content,
  token,
  email,
}: CommentFormData) => {
  await apiClient.post(
    `/posts/${postId}/comments`,
    { content, email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const useCreateComment = (): UseMutationResult<
  void, // mutation returns no data
  Error, // type of Error thrown by the mutation
  CommentFormData // parameter types
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onError: (error: Error) => {
      console.error("Error creating comment:", error);
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};
