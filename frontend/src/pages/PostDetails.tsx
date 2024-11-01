import Layout from "../layout/Layout";
import { format } from "date-fns";
import CommentList from "../features/comments/CommentList";

interface Post {
  id: string;
  title: string;
  content: string;
  heroImageUrl: string;
  author: string;
  date: string;
}

// mock post data
const mockPost: Post = {
  id: "1",
  title: "Post 1",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non dapibus ante. Nam rutrum, lorem ac volutpat condimentum, tortor turpis scelerisque dolor, et lacinia tortor felis sit amet nunc. Quisque ac tempus massa. Nunc eget risus a nisl porta feugiat. Phasellus bibendum, ligula ac consequat sollicitudin, augue augue lobortis mauris, nec placerat odio enim fringilla augue. Etiam pretium dui ut mi varius, et ultricies nunc consectetur. Curabitur enim elit, suscipit vitae sem id, bibendum dignissim sem. Vestibulum scelerisque varius velit in cursus. Praesent at vestibulum nibh. Phasellus sit amet lacus quis est mollis condimentum. Praesent ullamcorper risus quis odio luctus, id malesuada diam ullamcorper. Donec ultrices tincidunt neque. Ut ut libero et libero viverra tempus sed eget dolor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non dapibus ante. Nam rutrum, lorem ac volutpat condimentum, tortor turpis scelerisque dolor, et lacinia tortor felis sit amet nunc. Quisque ac tempus massa. Nunc eget risus a nisl porta feugiat. Phasellus bibendum, ligula ac consequat sollicitudin, augue augue lobortis mauris, nec placerat odio enim fringilla augue. Etiam pretium dui ut mi varius, et ultricies nunc consectetur. Curabitur enim elit, suscipit vitae sem id, bibendum dignissim sem. Vestibulum scelerisque varius velit in cursus. Praesent at vestibulum nibh. Phasellus sit amet lacus quis est mollis condimentum. Praesent ullamcorper risus quis odio luctus, id malesuada diam ullamcorper. Donec ultrices tincidunt neque. Ut ut libero et libero viverra tempus sed eget dolor.",
  heroImageUrl:
    "https://fastly.picsum.photos/id/95/1600/800.jpg?hmac=bWWfD3czSaIwnbm8YhsjcHphC6PAs8IaaO3gWi8xp18",
  author: "Author Name",
  date: "2024-01-01",
};

export default function PostDetail() {
  const post = mockPost; // Use mock data

  return (
    <Layout>
      <div className="space-y-8">
        <div className="relative">
          <img
            src={post.heroImageUrl}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-md"
          />
          <div className="absolute bottom-4 left-6 bg-opacity-60 bg-black text-white p-4 rounded-md">
            <h1 className="text-4xl font-semibold">{post.title}</h1>
            <p className="text-gray-300">
              By {post.author} on {format(new Date(post.date), "MMM do, yyyy")}
            </p>
          </div>
        </div>
        <div className="text-lg leading-relaxed">
          <p>{post.content}</p>
        </div>

        {/* Add the CommentList component below the post content */}
        <CommentList />
      </div>
    </Layout>
  );
}
