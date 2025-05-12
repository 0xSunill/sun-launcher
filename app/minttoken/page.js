'use client';
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Connection } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, mintTo } from '@solana/spl-token';

import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
const MintTokenPage = () => {
  // const [mintAddress, setMintAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const { publicKey, signTransaction, sendTransaction } = useWallet();


  const searchParams = useSearchParams();
  const defaultMint = searchParams.get('mint') || '';
  const [mintAddress, setMintAddress] = useState(defaultMint);
  



  const handleMint = async () => {
    if (!publicKey) {
      return toast.error('Please connect your wallet');
    }

    // try {
    //   setLoading(true);
    //   setStatus('Processing...');

    //   const mint = new PublicKey(mintAddress);
    //   const ata = await getAssociatedTokenAddress(mint, publicKey);
    //   const accountInfo = await connection.getAccountInfo(ata);

    //   const transaction = new web3.Transaction();

    //   if (!accountInfo) {
    //     // Add ATA creation instruction if not exists
    //     transaction.add(
    //       createAssociatedTokenAccountInstruction(publicKey, ata, publicKey, mint)
    //     );
    //   }

    //   transaction.add(
    //     await mintTo(
    //       connection,
    //       publicKey,       // payer
    //       mint,            // mint address
    //       ata,             // destination ATA
    //       publicKey,       // authority (assumes mint authority is current wallet)
    //       Number(amount) * 10 ** 9 // adjust decimals (default 9)
    //     )
    //   );

    //   const signed = await signTransaction(transaction);
    //   const sig = await sendTransaction(signed, connection);
    //   await connection.confirmTransaction(sig, 'confirmed');

    //   setStatus(`✅ Minted successfully! Tx: ${sig}`);
    // } catch (err) {
    //   console.error(err);
    //   setStatus('❌ Minting failed.');
    // }

    // setLoading(false);
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

          {status && (
            <p className="text-white text-sm mt-2 break-words text-center">
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MintTokenPage;
