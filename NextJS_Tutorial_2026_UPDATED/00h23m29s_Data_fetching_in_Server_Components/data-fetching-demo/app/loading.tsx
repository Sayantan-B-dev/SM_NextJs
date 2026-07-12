export default function Loading() {
  return (
    <div>
      <h1>Posts from JSONPlaceholder</h1>
      <p>Loading posts...</p>
      <div
        style={{
          height: 200,
          background: "#f0f0f0",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Fetching data...
      </div>
    </div>
  );
}
