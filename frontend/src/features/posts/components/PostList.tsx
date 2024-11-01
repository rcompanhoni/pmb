import { Link } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import { Post } from "../models/Post";

export default function PostList() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <div className="space-y-4">
      {posts.map((post: Post) => (
        <div
          key={post.id}
          className="p-4 border rounded-md shadow-sm hover:shadow-lg"
        >
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
      ))}
    </div>
  );
}
