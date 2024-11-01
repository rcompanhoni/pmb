import Comment from "./Comment";

const mockComments = [
  {
    id: "1",
    author: "Jane Doe",
    date: "Oct 31, 2024",
    content:
      "Great post! Really helped me understand how to implement Markdown in my blog.",
  },
  {
    id: "2",
    author: "John Smith",
    date: "Oct 30, 2024",
    content:
      "Thanks for the tutorial! I’ve added Markdown support to my own blog now.",
  },
  {
    id: "3",
    author: "John Smith",
    date: "Oct 30, 2024",
    content:
      "Thanks for the tutorial! I’ve added Markdown support to my own blog now.",
  },
  {
    id: "4",
    author: "John Smith",
    date: "Oct 30, 2024",
    content:
      "Thanks for the tutorial! I’ve added Markdown support to my own blog now.",
  },
  {
    id: "5",
    author: "John Smith",
    date: "Oct 30, 2024",
    content:
      "Thanks for the tutorial! I’ve added Markdown support to my own blog now.",
  },
];

export default function CommentList() {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="bg-gray-50 rounded-lg shadow-md p-4">
        {mockComments.map((comment) => (
          <Comment
            key={comment.id}
            author={comment.author}
            date={comment.date}
            content={comment.content}
          />
        ))}
      </div>
    </div>
  );
}
