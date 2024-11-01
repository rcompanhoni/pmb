import Layout from "../layout/Layout";
import PostList from "../features/posts/PostList";
import RecentPosts from "../features/posts/RecentPosts";

export default function Home() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-9/12">
          <PostList />
        </div>

        <div className="hidden md:block md:w-3/12">
          <RecentPosts />
        </div>
      </div>
    </Layout>
  );
}
