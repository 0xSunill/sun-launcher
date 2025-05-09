// components/WalletButton.tsx
'use client'

import dynamic from 'next/dynamic'

// Disable SSR for WalletMultiButton
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then(mod => mod.WalletMultiButton),
  { ssr: false }
)

export default WalletMultiButton
