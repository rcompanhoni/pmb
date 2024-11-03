import { useState } from "react";
import { useComments } from "../hooks/useComments";
import { Comment } from "../types";
import CommentItem from "./CommentItem";
import CommentModal from "./CommentModal";
import { useAuth } from "../../../context/AuthContext";
import NoListItems from "../../../components/EmptyState";
import EmptyState from "../../../components/EmptyState";

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
        {isLoading && <EmptyState message="Loading comments..." />}
        {isError && <EmptyState message="Error loading comments" />}

        {comments && comments.length > 0
          ? comments.map((comment: Comment) => (
              <div key={comment.id} className="mb-2 last:mb-0">
                <CommentItem
                  comment={comment}
                  key={comment.id}
                  postId={postId}
                />
              </div>
            ))
          : !isLoading &&
            !isError && <NoListItems message="No comments available." />}
      </div>

      <CommentModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        postId={postId}
        onSuccess={closeModal}
      />
    </div>
  );
}
