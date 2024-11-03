import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "../../../utils/api";
import { PostFormData } from "../types";

const createPost = async ({ token, ...data }: PostFormData): Promise<void> => {
  await apiClient.post("/posts", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useCreatePost = (): UseMutationResult<
  void, // mutation returns no data
  Error, // type of Error thrown by the mutation
  PostFormData // parameter types
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onError: (error: Error) => {
      console.error("Error creating post:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
