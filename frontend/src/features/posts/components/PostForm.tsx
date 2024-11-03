import { useEffect, useState } from "react";
import { PostFormData } from "../types";
import { useAuth } from "../../../context/AuthContext";
import { z } from "zod";

interface PostFormProps {
  onSubmit: (data: PostFormData) => void;
  initialData?: PostFormData;
  isSubmitting: boolean;
}

// validation schema
export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  heroImageUrl: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Image URL is required"),
  content: z.string().min(1, "Content is required"),
});

export default function PostForm({
  onSubmit,
  initialData,
  isSubmitting,
}: PostFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PostFormData>(
    initialData || { title: "", heroImageUrl: "", content: "" }
  );
  const [errors, setErrors] = useState<{
    [key in keyof PostFormData]?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validation with Zod
    const result = postSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      onSubmit({ ...formData, email: user?.email });
    } else {
      const validationErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0] in formData) {
          validationErrors[error.path[0]] = error.message;
        }
      });
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-gray-700">Hero Image URL</label>
        <input
          type="url"
          name="heroImageUrl"
          value={formData.heroImageUrl}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded w-full"
        />
        {errors.heroImageUrl && (
          <p className="text-red-500 text-sm">{errors.heroImageUrl}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700">Content</label>
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

      <button
        type="submit"
        className={`bg-blue-500 text-white px-4 py-2 rounded ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
