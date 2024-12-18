import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { usePosts } from "../hooks/usePosts";
import { Post } from "../types";
import PostPreview from "./PostPreview";
import PaginationControls from "../../../components/PaginationControls";
import { usePrefetchNextPostsPage } from "../hooks/usePrefetchNextPostsPage";
import NoListItems from "../../../components/EmptyState";

export default function PostList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 4;

  // get URL query param and reset the page when it changes
  const query = new URLSearchParams(useLocation().search);
  const search = query.get("search") || undefined;
  useEffect(() => {
    setPage(1);
  }, [search]);

  // fetch the current page data with the search term
  const { data, isLoading, isError } = usePosts(page, pageSize, search);

  // prefetch next page from the main Post list for optimization
  const totalPages = Math.ceil((data?.totalCount || 0) / pageSize);
  usePrefetchNextPostsPage(page, pageSize, totalPages, search);

  const handleCreatePost = () => {
    navigate("/post-editor");
  };

  // handle loading and error states
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading posts.</p>;

  return (
    <div className="space-y-4">
      {user && (
        <button
          onClick={handleCreatePost}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Create New Post
        </button>
      )}

      {!data?.posts.length ? (
        <NoListItems message="No posts available." />
      ) : (
        data?.posts.map((post: Post) => (
          <PostPreview key={post.id} post={post} />
        ))
      )}

      <PaginationControls
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
