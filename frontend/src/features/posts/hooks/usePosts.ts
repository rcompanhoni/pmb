import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";

export const fetchPosts = async (page = 1, pageSize = 10) => {
  const response = await apiClient.get("/posts", {
    params: { page, pageSize },
  });
  return response.data;
};

export const usePosts = (page = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["posts", page, pageSize],
    queryFn: () => fetchPosts(page, pageSize),
  });
};
