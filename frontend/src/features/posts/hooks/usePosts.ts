import { useQuery } from "@tanstack/react-query";
import apiClient from "../api";

const fetchPosts = async () => {
  const response = await apiClient.get("/posts");
  return response.data;
};

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
};
