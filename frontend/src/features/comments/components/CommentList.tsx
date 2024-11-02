import { useState } from "react";
import { useComments } from "../hooks/useComments";
import { Comment } from "../models/Comment";
import CommentItem from "./Comment";
import CommentModal from "./CommentModal"; // Import the new modal component
import { useAuth } from "../../../context/AuthContext";

interface CommentListProps {
  postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
  const { user } = useAuth();
  const { data: comments, isLoading, isError } = useComments(postId || "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {user && (
          <button
            onClick={openModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Create New Comment
          </button>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg shadow-md p-4">
        {isLoading && <p>Loading comments...</p>}

        {isError && <p className="text-red-500">Error loading comments.</p>}

        {comments && comments.length > 0
          ? comments.map((comment: Comment) => (
              <CommentItem comment={comment} key={comment.id} />
            ))
          : !isLoading && !isError && <p>No comments available.</p>}
      </div>

      <CommentModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        postId={postId}
        onSuccess={() => closeModal()}
      />
    </div>
  );
}
