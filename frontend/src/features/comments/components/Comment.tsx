import { Comment } from "../models/Comment";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800">{comment.user_id}</span>
        <span className="text-sm text-gray-500">{comment.created_at}</span>
      </div>
      <p className="mt-2 text-gray-700">{comment.content}</p>
    </div>
  );
}
