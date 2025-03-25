'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ask component to fix casing issues
const AskComponent = dynamic(() => import('../ask'), {
  ssr: true,
});

export default function AskPage() {
  return <AskComponent />;
} 