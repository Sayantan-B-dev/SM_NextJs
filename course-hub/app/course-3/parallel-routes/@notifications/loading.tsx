export default function NotificationsLoading() {
  return (
    <div>
      <h2>Notifications</h2>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            padding: "0.5rem 0",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              height: "0.85rem",
              width: `${70 + (i % 3) * 10}%`,
              background: "#e0e0e0",
              borderRadius: 4,
              marginBottom: "0.25rem",
            }}
          />
          <div
            style={{
              height: "0.7rem",
              width: `${30 + (i % 2) * 15}%`,
              background: "#e0e0e0",
              borderRadius: 4,
            }}
          />
        </div>
      ))}
    </div>
  );
}
