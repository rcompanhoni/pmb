import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../utils/api";

export const fetchPosts = async (page = 1, pageSize = 10, search = "") => {
  const response = await apiClient.get("/posts", {
    params: search ? { page, pageSize, search } : { page, pageSize },
  });
  return response.data;
};

export const usePosts = (page = 1, pageSize = 10, search = "") => {
  const isSearching = search.length > 0;

  return useQuery({
    queryKey: isSearching
      ? ["posts", page, pageSize, search]
      : ["posts", page, pageSize],
    queryFn: () => fetchPosts(page, pageSize, search),
    staleTime: isSearching ? 0 : 1000 * 60 * 5, // fresh for 5 mins if no search
    gcTime: isSearching ? 0 : 1000 * 60 * 30, // cache for 30 mins if no search
  });
};
