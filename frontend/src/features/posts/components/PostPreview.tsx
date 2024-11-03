import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Post } from "../types";
import { useAuth } from "../../../context/AuthContext";
import { useDeletePost } from "../hooks/useDeletePost";

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { user, token } = useAuth();
  const navigate = useNavigate();
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

  const handleEdit = () => {
    navigate(`/post-editor/${post.id}`);
  };

  return (
    <div className="p-4 border rounded-md shadow-sm hover:shadow-lg relative">
      <Link to={`/posts/${post.id}`}>
        <img
          src={post.hero_image_url}
          alt={post.title}
          className="w-full h-48 md:h-80 object-cover rounded-md mb-4 cursor-pointer"
        />
      </Link>

      <h2 className="text-2xl font-semibold">
        <Link to={`/posts/${post.id}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>

      <p className="text-gray-600">{post.content.slice(0, 100)}...</p>

      <p className="text-sm italic">
        By <span className="font-bold">{post.email}</span>
      </p>

      <Link
        to={`/posts/${post.id}`}
        className="text-blue-500 hover:underline mt-2 inline-block"
      >
        Read more
      </Link>

      {user?.id === post.user_id && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            onClick={handleEdit}
            className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md flex items-center"
          >
            <FaEdit className="w-4 h-4" />
            <span className="hidden md:inline ml-1">Edit</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center"
          >
            <FaTrash className="w-4 h-4" />
            <span className="hidden md:inline ml-1">
              {isDeleting ? "Deleting..." : "Delete"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
