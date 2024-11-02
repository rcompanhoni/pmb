import { useState } from "react";
import { usePosts } from "../hooks/usePosts";
import { Post } from "../models/Post";
import PostPreview from "./PostPreview";
import PaginationControls from "../../../components/PaginationControls";

export default function PostList() {
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const { data, isLoading, isError } = usePosts(page, pageSize);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts.</p>;

  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);

  return (
    <div className="space-y-4">
      {data?.posts.map((post: Post) => (
        <PostPreview key={post.id} post={post} />
      ))}

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
