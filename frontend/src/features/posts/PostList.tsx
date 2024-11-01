import { Link } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  content: string;
  heroImageUrl: string;
}

const posts: Post[] = [
  {
    id: "1",
    title: "Post 1",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non dapibus ante. Nam rutrum, lorem ac volutpat condimentum, tortor turpis scelerisque dolor, et lacinia tortor felis sit amet nunc. Quisque ac tempus massa. Nunc eget risus a nisl porta feugiat. Phasellus bibendum, ligula ac consequat sollicitudin, augue augue lobortis mauris, nec placerat odio enim fringilla augue. Etiam pretium dui ut mi varius, et ultricies nunc consectetur. Curabitur enim elit, suscipit vitae sem id, bibendum dignissim sem. Vestibulum scelerisque varius velit in cursus. Praesent at vestibulum nibh. Phasellus sit amet lacus quis est mollis condimentum. Praesent ullamcorper risus quis odio luctus, id malesuada diam ullamcorper. Donec ultrices tincidunt neque. Ut ut libero et libero viverra tempus sed eget dolor.",
    heroImageUrl:
      "https://fastly.picsum.photos/id/95/1600/800.jpg?hmac=bWWfD3czSaIwnbm8YhsjcHphC6PAs8IaaO3gWi8xp18",
  },
  {
    id: "2",
    title: "Post 2",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non dapibus ante. Nam rutrum, lorem ac volutpat condimentum, tortor turpis scelerisque dolor, et lacinia tortor felis sit amet nunc. Quisque ac tempus massa. Nunc eget risus a nisl porta feugiat. Phasellus bibendum, ligula ac consequat sollicitudin, augue augue lobortis mauris, nec placerat odio enim fringilla augue. Etiam pretium dui ut mi varius, et ultricies nunc consectetur. Curabitur enim elit, suscipit vitae sem id, bibendum dignissim sem. Vestibulum scelerisque varius velit in cursus. Praesent at vestibulum nibh. Phasellus sit amet lacus quis est mollis condimentum. Praesent ullamcorper risus quis odio luctus, id malesuada diam ullamcorper. Donec ultrices tincidunt neque. Ut ut libero et libero viverra tempus sed eget dolor.",
    heroImageUrl:
      "https://fastly.picsum.photos/id/397/1600/800.jpg?hmac=XX2chdsj3A0ektW_4akeNopzBCMlrbo1JJcboyH_SD4",
  },
  {
    id: "3",
    title: "Post 3",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non dapibus ante. Nam rutrum, lorem ac volutpat condimentum, tortor turpis scelerisque dolor, et lacinia tortor felis sit amet nunc. Quisque ac tempus massa. Nunc eget risus a nisl porta feugiat. Phasellus bibendum, ligula ac consequat sollicitudin, augue augue lobortis mauris, nec placerat odio enim fringilla augue. Etiam pretium dui ut mi varius, et ultricies nunc consectetur. Curabitur enim elit, suscipit vitae sem id, bibendum dignissim sem. Vestibulum scelerisque varius velit in cursus. Praesent at vestibulum nibh. Phasellus sit amet lacus quis est mollis condimentum. Praesent ullamcorper risus quis odio luctus, id malesuada diam ullamcorper. Donec ultrices tincidunt neque. Ut ut libero et libero viverra tempus sed eget dolor.",
    heroImageUrl:
      "https://fastly.picsum.photos/id/662/1600/800.jpg?hmac=Gaqc9Oz9zuuAOjQUeHDv5dVeT4CPF7zdtXB1KVfdkIk",
  },
  {
    id: "4",
    title: "Post 4",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque non dapibus ante. Nam rutrum, lorem ac volutpat condimentum, tortor turpis scelerisque dolor, et lacinia tortor felis sit amet nunc. Quisque ac tempus massa. Nunc eget risus a nisl porta feugiat. Phasellus bibendum, ligula ac consequat sollicitudin, augue augue lobortis mauris, nec placerat odio enim fringilla augue. Etiam pretium dui ut mi varius, et ultricies nunc consectetur. Curabitur enim elit, suscipit vitae sem id, bibendum dignissim sem. Vestibulum scelerisque varius velit in cursus. Praesent at vestibulum nibh. Phasellus sit amet lacus quis est mollis condimentum. Praesent ullamcorper risus quis odio luctus, id malesuada diam ullamcorper. Donec ultrices tincidunt neque. Ut ut libero et libero viverra tempus sed eget dolor.",
    heroImageUrl:
      "https://fastly.picsum.photos/id/718/1600/800.jpg?hmac=L0ZXutBgKGieQoXMkYiW2HriFcRtMtl1s-oUyqQeKDU",
  },
];

export default function PostList() {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="p-4 border rounded-md shadow-sm hover:shadow-lg"
        >
          <img
            src={post.heroImageUrl}
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
