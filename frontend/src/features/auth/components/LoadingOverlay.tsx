import { useIsFetching } from "@tanstack/react-query";

export default function LoadingOverlay() {
  const isFetching = useIsFetching();

  return (
    isFetching > 0 && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50" />
    )
  );
}
