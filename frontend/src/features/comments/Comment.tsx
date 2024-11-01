interface CommentProps {
  author: string;
  date: string;
  content: string;
}

export default function Comment({ author, date, content }: CommentProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800">{author}</span>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="mt-2 text-gray-700">{content}</p>
    </div>
  );
}
