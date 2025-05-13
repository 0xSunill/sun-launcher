"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { createMint } from "@solana/spl-token";



export default function AppWalletProvider({ children }) {
  // const network = WalletAdapterNetwork.devnet; // Change this to your desired network (devnet, testnet, mainnet-beta)
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const endpoint = clusterApiUrl(`mainnet-betahttps://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`);

  // mainnet
  // const endpoint = useMemo(
  //   () => `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`,
  //   []
  // );

  // devnet
  const endpoint_devnet = useMemo(
    () => `https://devnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY_DEVNET}`,
    []
  );

  // const wallets = useMemo(
  //   () => [
  //     new PhantomWalletAdapter(),
  //     new SolflareWalletAdapter({ network }),
  //     new TorusWalletAdapter(),
  //   ],
  //   [network],
  // );

  return (
    <ConnectionProvider endpoint={endpoint_devnet} >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>


          {children}

        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}