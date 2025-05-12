'use client';
import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  TOKEN_2022_PROGRAM_ID,
  getMint,
  getAccount,
} from '@solana/spl-token';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const MintTokenPage = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();
  const searchParams = useSearchParams();
  const defaultMint = searchParams.get('mint') || '';
  const [mintAddress, setMintAddress] = useState(defaultMint);

  const handleMint = async () => {
    if (!wallet.publicKey) {
      return toast.error('Please connect your wallet');
    }

    setLoading(true);
    const loadingToast = toast.loading("Minting...");
    const mint = new PublicKey(mintAddress);

    try {
      const associatedToken = getAssociatedTokenAddressSync(
        mint,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
      );

      console.log("Associated Token Address:", associatedToken.toBase58());

      // ✅ Check if ATA exists
      try {
        await getAccount(connection, associatedToken, undefined, TOKEN_2022_PROGRAM_ID);
        console.log("ATA already exists");
      } catch (err) {
        // ❗ Create ATA only if it doesn't exist
        console.log("Creating ATA...");
        const ataTx = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedToken,
            wallet.publicKey,
            mint,
            TOKEN_2022_PROGRAM_ID,
          )
        );
        await wallet.sendTransaction(ataTx, connection);
      }

      // Get decimals and calculate mint amount
      const mintInfo = await getMint(connection, mint, undefined, TOKEN_2022_PROGRAM_ID);
      const decimals = mintInfo.decimals;
      const mintAmount = Number(amount) * 10 ** decimals;

      // Mint tokens
      const mintTx = new Transaction().add(
        createMintToInstruction(
          mint,
          associatedToken,
          wallet.publicKey,
          mintAmount,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      await wallet.sendTransaction(mintTx, connection);

      toast.dismiss(loadingToast);
      toast.success("Minted!", {
        duration: 5000,
        iconTheme: {
          primary: '#4ade80',
          secondary: '#1e1e2f',
        },
      });

      console.log("Mint successful!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to mint", {
        id: loadingToast,
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[linear-gradient(135deg,_#0b0b1a_47%,_#a855f7_50%,_#0b0b1a_53%)] h-screen pt-28 px-4 md:px-16">
      <div className="bg-black/30 backdrop-blur-2xl border border-gray-800 rounded-3xl p-8 md:p-12 w-full max-w-4xl mx-auto shadow-xl flex flex-col items-center gap-10">
        <h1 className="text-white text-3xl md:text-4xl font-bold text-center">
          Mint Token to Your Account
        </h1>

        <div className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Token Mint Address"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Amount to Mint"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none"
          />

          <button
            onClick={handleMint}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all"
          >
            {loading ? 'Minting...' : 'Mint'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MintTokenPage;
