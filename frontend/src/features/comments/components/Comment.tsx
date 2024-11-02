import { format } from "date-fns";
import { Comment } from "../models/Comment";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800">{comment.email}</span>
        <span className="text-sm text-gray-500">
          {format(new Date(comment.created_at), "MMM do, yyyy")}
        </span>
      </div>
      <p className="mt-2 text-gray-700">{comment.content}</p>
    </div>
  );
}
