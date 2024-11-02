import { useComments } from "../hooks/useComments";
import { Comment } from "../models/Comment";
import CommentItem from "./Comment";

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const { data: comments, isLoading, isError } = useComments(postId || "");

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="bg-gray-50 rounded-lg shadow-md p-4">
        {isLoading && <p>Loading comments...</p>}

        {isError && <p className="text-red-500">Error loading comments.</p>}

        {comments && comments.length > 0
          ? comments.map((comment: Comment) => (
              <CommentItem comment={comment} key={comment.id} />
            ))
          : !isLoading && !isError && <p>No comments available.</p>}
      </div>
    </div>
  );
}
