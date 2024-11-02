import { format } from "date-fns";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { Comment } from "../models/Comment";
import CommentModal from "./CommentModal";

interface CommentItemProps {
  comment: Comment;
  postId: string;
}

export default function CommentItem({ comment, postId }: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const closeModal = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-gray-800">{comment.email}</span>
          <span>-</span>{" "}
          <span className="text-sm text-gray-500">
            {format(new Date(comment.created_at), "MMM do, yyyy")}
          </span>
        </div>

        {user?.email === comment.email && (
          <button
            onClick={handleEditClick}
            className="text-blue-500 hover:text-blue-700"
          >
            <FaEdit className="inline-block w-4 h-4" />
          </button>
        )}
      </div>

      <p className="mt-2 text-gray-700">{comment.content}</p>

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
