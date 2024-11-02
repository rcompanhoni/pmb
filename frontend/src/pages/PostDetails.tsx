import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import CommentList from "../features/comments/components/CommentList";
import { usePost } from "../features/posts/hooks/usePost";
import PostItem from "../features/posts/components/PostItem";

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const { data: post, isLoading, isError } = usePost(postId || "");

  // loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>Loading post...</p>
        </div>
      </Layout>
    );
  }

  // error state
  if (isError) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">
            Error loading the post. Please try again.
          </p>
        </div>
      </Layout>
    );
  }

  // post not found
  if (!postId || !post) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500">Post not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <PostItem post={post} />
        <CommentList postId={postId} />
      </div>
    </Layout>
  );
}
