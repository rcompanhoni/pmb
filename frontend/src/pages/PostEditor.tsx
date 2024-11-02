import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PostForm from "../features/posts/components/PostForm";
import { useCreatePost } from "../features/posts/hooks/useCreatePost";
import { PostFormData } from "../features/posts/models/PostFormData";

export default function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { mutate: createPost } = useCreatePost();

  const handleCreatePost = (data: PostFormData) => {
    if (token) {
      createPost(
        { ...data, token },
        {
          onSuccess: () => {
            navigate("/");
          },
        }
      );
    } else {
      console.error("User not authenticated");
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
        <PostForm onSubmit={handleCreatePost} />
      </div>
    </Layout>
  );
}
