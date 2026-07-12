"use client";

import { useState } from "react";

export default function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button
      onClick={() => setLiked((prev) => !prev)}
      style={{
        backgroundColor: liked ? "#ef4444" : "#334155",
        padding: "0.25rem 0.75rem",
        fontSize: "0.8rem",
      }}
      aria-label={liked ? "Unlike" : "Like"}
    >
      {liked ? "Unlike" : "Like"}
    </button>
  );
}
