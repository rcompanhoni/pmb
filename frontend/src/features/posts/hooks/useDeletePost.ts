import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import apiClient from "../../../utils/api";

const deletePost = async ({
  postId,
  token,
}: {
  postId: string;
  token: string;
}): Promise<void> => {
  await apiClient.delete(`/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useDeletePost = (): UseMutationResult<
  void,
  Error,
  { postId: string; token: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // invalidate the posts query to refresh the list after deletion
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting post:", error);
    },
  });
};
