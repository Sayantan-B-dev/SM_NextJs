"use client";

import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const router = useRouter();

  return (
    <button className="btn" onClick={() => router.refresh()}>
      Refresh (Trigger Re-fetch)
    </button>
  );
}
