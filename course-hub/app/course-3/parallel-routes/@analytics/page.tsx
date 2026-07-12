export default function AnalyticsSlot() {
  const bars = [
    { label: "Page Views", value: 85 },
    { label: "Conversion", value: 62 },
    { label: "Bounce Rate", value: 28 },
    { label: "Sessions", value: 91 },
    { label: "Revenue", value: 74 },
  ];

  return (
    <div>
      <h2>Analytics</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {bars.map((bar) => (
          <div key={bar.label}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                marginBottom: "0.25rem",
              }}
            >
              <span>{bar.label}</span>
              <span>{bar.value}%</span>
            </div>
            <div
              style={{
                height: 10,
                background: "#e0e0e0",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${bar.value}%`,
                  height: "100%",
                  background: bar.value > 70 ? "#2e7d32" : bar.value > 40 ? "#f57f17" : "#d32f2f",
                  borderRadius: 5,
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
