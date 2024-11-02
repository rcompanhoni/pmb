import { Link } from "react-router-dom";
import { Post } from "../models/Post";

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="p-4 border rounded-md shadow-sm hover:shadow-lg">
      <img
        src={post.hero_image_url}
        alt={post.title}
        className="w-full h-48 md:h-80 object-cover rounded-md mb-4"
      />
      <h2 className="text-2xl font-semibold">{post.title}</h2>
      <p className="text-gray-600">{post.content.slice(0, 100)}...</p>
      <Link
        to={`/posts/${post.id}`}
        className="text-blue-500 hover:underline mt-2 inline-block"
      >
        Read more
      </Link>
    </div>
  );
}
