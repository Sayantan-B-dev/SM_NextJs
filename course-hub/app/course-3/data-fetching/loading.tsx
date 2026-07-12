export default function DataFetchingLoading() {
  return (
    <div>
      <h1 className="page-title">Data Fetching Patterns</h1>
      <p className="page-subtitle">Loading posts and users...</p>
      <div className="grid-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card" style={{ opacity: 0.5 }}>
            <div style={{ height: "1.2rem", width: "60%", background: "#e0e0e0", marginBottom: "0.5rem", borderRadius: 4 }} />
            <div style={{ height: "0.8rem", width: "90%", background: "#e0e0e0", marginBottom: "0.3rem", borderRadius: 4 }} />
            <div style={{ height: "0.8rem", width: "70%", background: "#e0e0e0", borderRadius: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
