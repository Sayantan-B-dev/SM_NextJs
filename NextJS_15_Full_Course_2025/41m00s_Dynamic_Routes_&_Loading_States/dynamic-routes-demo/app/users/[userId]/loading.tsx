export default function UserProfileLoading() {
  return (
    <div>
      <div className="skeleton-pulse" />
      <div className="skeleton-pulse" style={{ width: "60%" }} />
      <div className="skeleton-pulse" style={{ width: "40%" }} />
      <p>Loading user details...</p>
    </div>
  );
}
