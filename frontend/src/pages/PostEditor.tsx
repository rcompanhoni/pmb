import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostForm from "../features/posts/components/PostForm";
import { useCreatePost } from "../features/posts/hooks/useCreatePost";
import { useUpdatePost } from "../features/posts/hooks/useUpdatePost";
import { usePost } from "../features/posts/hooks/usePost";
import { PostFormData } from "../features/posts/models/PostFormData";

export default function PostEditor() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { data: post, isLoading } = usePost(postId || "");
  const { mutate: createPost } = useCreatePost();
  const { mutate: updatePost } = useUpdatePost();
  const [initialValues, setInitialValues] = useState<PostFormData | undefined>(
    undefined
  );

  useEffect(() => {
    if (post && postId) {
      setInitialValues({
        title: post.title,
        heroImageUrl: post.hero_image_url,
        content: post.content,
      });
    }
  }, [post, postId]);

  const handleSubmit = (data: PostFormData) => {
    if (token) {
      if (postId) {
        // editing an existing post
        updatePost(
          { postId, ...data, token },
          {
            onSuccess: () => navigate("/"),
          }
        );
      } else {
        // creating a new post
        createPost(
          { ...data, token },
          {
            onSuccess: () => navigate("/"),
          }
        );
      }
    } else {
      console.error("User not authenticated");
    }
  };

  if (isLoading && postId) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          {postId ? "Edit Post" : "Create New Post"}
        </h1>
        <PostForm onSubmit={handleSubmit} initialData={initialValues} />
      </div>
    </Layout>
  );
}
