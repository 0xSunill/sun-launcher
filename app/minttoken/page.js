import MintTokenPage from '@/components/MintTokenPage';
import React, { Suspense } from 'react';
// import MintTokenPage from './MintTokenPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center pt-10">Loading Mint Page...</div>}>
      <MintTokenPage />
    </Suspense>
  );
}
