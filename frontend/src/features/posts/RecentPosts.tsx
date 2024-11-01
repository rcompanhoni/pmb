import { Link } from "react-router-dom";

const recentPosts = [
  { id: "1", title: "Recent Post 1" },
  { id: "2", title: "Recent Post 2" },
  { id: "3", title: "Recent Post 3" },
];

export default function RecentPosts() {
  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full md:w-auto">
      <h2 className="text-lg font-semibold mb-4">Most Recent Posts</h2>
      <ul className="space-y-2">
        {recentPosts.map((post) => (
          <li key={post.id}>
            <Link
              to={`/posts/${post.id}`}
              className="text-blue-500 hover:underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
