const notifications = [
  { id: 1, message: "Deployment successful", time: "2 min ago" },
  { id: 2, message: "New user registered", time: "15 min ago" },
  { id: 3, message: "Database backup completed", time: "1 hour ago" },
  { id: 4, message: "SSL certificate renewing", time: "3 hours ago" },
  { id: 5, message: "Memory usage exceeded 80%", time: "5 hours ago" },
];

export default async function NotificationsSlot() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <div>
      <h2>Notifications</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {notifications.map((n) => (
          <li
            key={n.id}
            style={{
              padding: "0.5rem 0",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <div style={{ fontSize: "0.9rem" }}>{n.message}</div>
            <div style={{ fontSize: "0.75rem", color: "#666" }}>{n.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
