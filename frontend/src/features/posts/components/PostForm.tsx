import { useState } from "react";
import { PostFormData, postSchema } from "../models/PostFormData";
import { useAuth } from "../../../context/AuthContext";

interface PostFormProps {
  onSubmit: (data: PostFormData) => void;
  initialData?: PostFormData;
}

export default function PostForm({ onSubmit, initialData }: PostFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PostFormData>(
    initialData || { title: "", heroImageUrl: "", content: "" } // either creating or editing an existing Post
  );
  const [errors, setErrors] = useState<{
    [key in keyof PostFormData]?: string;
  }>({});

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
      debugger;
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
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
}
