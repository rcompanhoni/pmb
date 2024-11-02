import { Link } from "react-router-dom";
import { Post } from "../models/Post";
import { useAuth } from "../../../context/AuthContext";
import { useDeletePost } from "../hooks/useDeletePost";
import { FaTrash } from "react-icons/fa";

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { user, token } = useAuth();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      if (token) {
        deletePost({ postId: post.id, token });
      } else {
        console.error("User not authenticated");
      }
    }
  };

  return (
    <div className="p-6 border rounded-md shadow-sm hover:shadow-lg relative">
      <Link to={`/posts/${post.id}`}>
        <img
          src={post.hero_image_url}
          alt={post.title}
          className="w-full h-48 md:h-80 object-cover rounded-md mb-4 cursor-pointer"
        />
      </Link>
      <h2 className="text-2xl font-semibold mb-2">
        <Link to={`/posts/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className="text-gray-600 mb-2">{post.content.slice(0, 150)}...</p>
      <div className="text-sm text-gray-500 italic mt-6">
        By <span className="font-semibold">{post.email}</span>
      </div>
      <Link
        to={`/posts/${post.id}`}
        className="text-blue-500 hover:underline mt-2 inline-block"
      >
        Read more
      </Link>

      {user?.id === post.user_id && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center space-x-2"
        >
          <FaTrash className="w-4 h-4" />
          <span className="hidden md:inline">
            {isDeleting ? "Deleting..." : "Delete"}
          </span>
        </button>
      )}
    </div>
  );
}
