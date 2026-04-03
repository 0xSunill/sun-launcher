import LiquidityPage from '@/components/LiquidityPage';
import React, { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center pt-10">Loading...</div>}>
      <LiquidityPage />
    </Suspense>
  );
}