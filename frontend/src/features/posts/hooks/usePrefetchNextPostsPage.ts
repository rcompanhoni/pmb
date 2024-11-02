import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchPosts } from "./usePosts";

export const usePrefetchNextPostsPage = (
  page: number,
  pageSize: number,
  totalPages: number
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const nextPage = page + 1;

    // prefetch only if there is a next page
    if (nextPage <= totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage, pageSize],
        queryFn: () => fetchPosts(nextPage, pageSize),
        staleTime: 1000 * 60 * 5, // data fresh for 5 minutes
        gcTime: 1000 * 60 * 30, // garbage collected if unused for 30 minutes
      });
    }
  }, [page, pageSize, totalPages, queryClient]);
};
