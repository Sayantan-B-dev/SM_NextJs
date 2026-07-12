export default function ParallelRoutesLayout({
  children,
  analytics,
  notifications,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  notifications: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">
        Parallel route slots for analytics and notifications.
      </p>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        <div style={{ flex: 1 }}>
          <div className="card">{children}</div>
          <div className="card" style={{ marginTop: "1rem" }}>
            {analytics}
          </div>
        </div>
        <div style={{ width: 320, minWidth: 320 }}>
          <div className="card">{notifications}</div>
        </div>
      </div>
    </div>
  );
}
