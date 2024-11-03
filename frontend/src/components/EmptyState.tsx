interface EmptyStateProps {
  message: string;
  isError?: boolean;
}

export default function EmptyState({
  message,
  isError = false,
}: EmptyStateProps) {
  return (
    <div
      className={`text-center p-4 ${
        isError ? "text-red-500 font-semibold" : "text-gray-500"
      }`}
    >
      <p>{message}</p>
    </div>
  );
}
