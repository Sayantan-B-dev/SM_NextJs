"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 className="page-title" style={{ color: "#d32f2f" }}>
        Something went wrong
      </h1>
      <p className="page-subtitle">{error.message}</p>
      <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
        Error digest: {error.digest ?? "N/A"}
      </p>
      <button className="btn" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
