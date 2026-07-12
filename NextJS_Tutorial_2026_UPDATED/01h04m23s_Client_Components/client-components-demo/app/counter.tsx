'use client';

import { useState } from 'react';

type Props = {
  count: number;
};

// Leaf Client Component: only responsible for displaying and incrementing a count.
// "use client" is on the smallest possible unit.
export function Counter({ count }: Props) {
  const [localCount, setLocalCount] = useState(count);

  return (
    <span
      style={{
        background: '#f0f0f0',
        padding: '0.25rem 0.75rem',
        borderRadius: '12px',
        fontSize: '0.9rem',
        fontWeight: 600,
      }}
    >
      {localCount} {localCount === 1 ? 'vote' : 'votes'}
    </span>
  );
}
