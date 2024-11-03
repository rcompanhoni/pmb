import { useState } from "react";
import { format } from "date-fns";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { Comment } from "../types";
import CommentModal from "./CommentModal";
import { useDeleteComment } from "../hooks/useDeleteComment";

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

export default function CommentItem({ comment, postId }: CommentItemProps) {
  const { user, token } = useAuth();
  const { mutate: deleteComment } = useDeleteComment();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      if (token) {
        deleteComment({ postId, commentId: comment.id, token });
      } else {
        console.error("User not authenticated");
      }
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-white rounded-lg shadow-md flex flex-col relative space-y-2">
      <div className="flex justify-between items-start">
        <div className="text-sm font-semibold text-gray-800">
          {comment.email}
        </div>

        {user?.email === comment.email && (
          <div className="flex space-x-2">
            <button
              onClick={handleEditClick}
              className="text-blue-500 hover:text-blue-700 p-1"
            >
              <FaEdit className="w-5 h-5" />
            </button>

            <button
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <FaTrash className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        {format(new Date(comment.created_at), "MMM d, yyyy")}
      </div>

      <p className="text-gray-700 mt-1">{comment.content}</p>

      {isEditing && (
        <CommentModal
          isOpen={isEditing}
          onRequestClose={closeModal}
          postId={postId}
          initialData={{ content: comment.content }}
          onSuccess={closeModal}
          commentId={comment.id}
        />
      )}
    </div>
  );
}
