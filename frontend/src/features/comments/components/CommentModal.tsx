import { useState, useEffect } from "react";
import Modal from "react-modal";
import { z } from "zod";
import { useCreateComment } from "../hooks/useCreateComment";
import { useUpdateComment } from "../hooks/useUpdateComment";
import { useAuth } from "../../../context/AuthContext";

// validation schema
const commentSchema = z.object({
  content: z.string().min(1, "Comment content cannot be empty"),
});

interface CommentModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  postId: string;
  commentId?: string;
  initialData?: { content: string };
  onSuccess: () => void;
}

export default function CommentModal({
  isOpen,
  onRequestClose,
  postId,
  commentId,
  initialData,
  onSuccess,
}: CommentModalProps) {
  const { token, user } = useAuth();
  const { mutate: createComment } = useCreateComment();
  const { mutate: updateComment } = useUpdateComment();
  const [formData, setFormData] = useState({
    content: initialData?.content || "",
  });
  const [errors, setErrors] = useState<{ content?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ content: initialData.content });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateComment = () => {
    setIsSubmitting(true);
    createComment(
      {
        postId,
        content: formData.content,
        token: token || "",
        email: user?.email || "",
      },
      {
        onSuccess: () => {
          onRequestClose();
          setFormData({ content: "" });
          onSuccess();
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleUpdateComment = () => {
    setIsSubmitting(true);
    updateComment(
      {
        postId,
        commentId: commentId!,
        content: formData.content,
        token: token || "",
        email: user?.email || "",
      },
      {
        onSuccess: () => {
          onRequestClose();
          setFormData({ content: "" });
          onSuccess();
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = commentSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      if (initialData && commentId) {
        handleUpdateComment();
      } else {
        handleCreateComment();
      }
    } else {
      const validationErrors: { content?: string } = {};
      result.error.errors.forEach((error) => {
        validationErrors[error.path[0] as "content"] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="bg-white w-full max-w-md mx-auto mt-24 p-6 rounded-lg shadow-lg"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      ariaHideApp={false}
    >
      <h2 className="text-xl font-bold mb-4">
        {initialData ? "Edit Comment" : "Create New Comment"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Comment Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded w-full"
            rows={4}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onRequestClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
