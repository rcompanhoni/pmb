import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "../../../utils/api";

interface DeleteCommentParams {
  postId: string;
  commentId: string;
  token: string;
}

const deleteComment = async ({
  postId,
  commentId,
  token,
}: DeleteCommentParams) => {
  debugger;
  await apiClient.delete(`/posts/${postId}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useDeleteComment = (): UseMutationResult<
  void,
  Error,
  DeleteCommentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (_, { postId }) => {
      // invalidate the posts query to refresh the list after deletion
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error: Error) => {
      console.error("Error deleting comment:", error);
    },
  });
};
