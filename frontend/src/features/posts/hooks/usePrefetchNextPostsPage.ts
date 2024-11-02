import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "./usePosts";

export const usePrefetchNextPostsPage = (
  page: number,
  pageSize: number,
  totalPages: number,
  search?: string
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (search) return; // skip prefetching if there's a search term

    const nextPage = page + 1;
    if (nextPage <= totalPages) {
      const queryKey = ["posts", nextPage, pageSize];
      const isCached = queryClient.getQueryData(queryKey);

      if (!isCached) {
        queryClient.prefetchQuery({
          queryKey,
          queryFn: () => fetchPosts(nextPage, pageSize),
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 30,
        });
      }
    }
  }, [page, pageSize, totalPages, search, queryClient]);
};
