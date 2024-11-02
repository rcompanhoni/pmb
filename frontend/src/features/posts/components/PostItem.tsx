import { format } from "date-fns";
import { Post } from "../models/Post";

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  return (
    <>
      <div className="relative">
        <img
          src={post.hero_image_url}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-md"
        />

        <div className="absolute bottom-4 left-6 bg-opacity-60 bg-black text-white p-4 rounded-md">
          <h1 className="text-4xl font-semibold">{post.title}</h1>
          <p className="text-gray-300">
            By <span className="font-bold">{post.email}</span> on{" "}
            {format(new Date(post.created_at), "MMM do, yyyy")}
          </p>
        </div>
      </div>

      <div className="text-lg leading-relaxed">
        <p>{post.content}</p>
      </div>
    </>
  );
}
