import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import { CommentFormData } from "../types";

const updateComment = async ({
  postId,
  commentId,
  content,
  token,
  email,
}: CommentFormData) => {
  await apiClient.put(
    `/posts/${postId}/comments/${commentId}`,
    { content, email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const useUpdateComment = (): UseMutationResult<
  void, // mutation returns no data
  Error, // type of Error thrown by the mutation
  CommentFormData // parameter types
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onError: (error: Error) => {
      console.error("Error updating comment:", error);
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
};
