import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";

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
