"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message || "An unexpected error occurred."}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}
