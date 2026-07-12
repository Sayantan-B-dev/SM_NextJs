export default function ParallelRoutesHome() {
  return (
    <div>
      <h2>Dashboard Overview</h2>
      <p>
        This is a parallel route dashboard. The main content area shows the
        default page, while the sidebar displays analytics and notifications
        loaded in parallel slots. Each slot can have its own loading and error
        states, and is independently streamed.
      </p>
    </div>
  );
}
