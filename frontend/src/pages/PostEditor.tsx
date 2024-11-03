import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostForm from "../features/posts/components/PostForm";
import { useCreatePost } from "../features/posts/hooks/useCreatePost";
import { useUpdatePost } from "../features/posts/hooks/useUpdatePost";
import { usePost } from "../features/posts/hooks/usePost";
import { PostFormData } from "../features/posts/types";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post && postId) {
      setInitialValues({
        title: post.title,
        heroImageUrl: post.hero_image_url,
        content: post.content,
      });
    }
  }, [post, postId]);

  const handleCreate = (data: PostFormData) => {
    setIsSubmitting(true);
    createPost(
      { ...data, token: token! },
      {
        onSuccess: () => {
          navigate("/");
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleUpdate = (data: PostFormData) => {
    setIsSubmitting(true);
    updatePost(
      { postId: postId!, ...data, token: token! },
      {
        onSuccess: () => navigate("/"),
        onSettled: () => setIsSubmitting(false),
      }
    );
  };

  const handleSubmit = (data: PostFormData) => {
    if (!token) {
      console.error("User not authenticated");
      return;
    }
    postId ? handleUpdate(data) : handleCreate(data);
  };

  if (isLoading && postId) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          {postId ? "Edit Post" : "Create New Post"}
        </h1>
        <PostForm
          onSubmit={handleSubmit}
          initialData={initialValues}
          isSubmitting={isSubmitting}
        />
      </div>
    </Layout>
  );
}
