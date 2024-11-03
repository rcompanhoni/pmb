import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import CommentList from "../features/comments/components/CommentList";
import { usePost } from "../features/posts/hooks/usePost";
import PostItem from "../features/posts/components/PostItem";
import EmptyState from "../components/EmptyState";

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const { data: post, isLoading, isError } = usePost(postId || "");

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <EmptyState message="Loading post..." />
        </div>
      </Layout>
    );
  }

  if (isError || !postId || !post) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <EmptyState isError message="Error loading the post" />
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
