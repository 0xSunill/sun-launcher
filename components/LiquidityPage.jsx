'use client';

import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, getMint } from '@solana/spl-token';
import { Raydium, TxVersion, parseTokenAccountResp } from '@raydium-io/raydium-sdk-v2';
import Decimal from 'decimal.js';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Raydium devnet CPMM program
const CPMM_PROGRAM_ID = new PublicKey('CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C');
// Wrapped SOL mint
const WSOL_MINT = new PublicKey('So11111111111111111111111111111111111111112');

const LiquidityPage = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, signAllTransactions, signTransaction, sendTransaction } = wallet;
  const router = useRouter();

  const [mintAddress, setMintAddress] = useState('');
  const [solAmount, setSolAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [poolResult, setPoolResult] = useState(null);

  const handleCreatePool = async () => {
    if (!wallet.connected || !publicKey) {
      toast.error('Connect your wallet first.');
      return;
    }
    if (!mintAddress || !solAmount || !tokenAmount) {
      toast.error('Please fill in all fields.');
      return;
    }

    let tokenMint;
    try {
      tokenMint = new PublicKey(mintAddress);
    } catch {
      toast.error('Invalid mint address.');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('Creating liquidity pool...');

    try {
      // Load Raydium SDK
      console.log('[DEBUG] Step 1: Loading Raydium SDK...');
      const raydium = await Raydium.load({
        owner: publicKey,
        connection,
        cluster: 'devnet',
        disableFeatureCheck: true,
        blockhashCommitment: 'finalized',
        signAllTransactions,
      });
      console.log('[DEBUG] Step 1 done.');

      // Fetch token accounts for the connected wallet
      console.log('[DEBUG] Step 2: Fetching token accounts...');
      const solAccountResp = await connection.getAccountInfo(publicKey);
      const token2022Resp = await connection.getTokenAccountsByOwner(publicKey, { programId: TOKEN_2022_PROGRAM_ID });
      const tokenResp = await connection.getTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });

      raydium.account.updateTokenAccount(
        parseTokenAccountResp({
          owner: publicKey,
          solAccountResp,
          tokenAccountResp: {
            context: tokenResp.context,
            value: [...tokenResp.value, ...token2022Resp.value],
          },
        })
      );
      console.log('[DEBUG] Step 2 done.');

      // Fetch mint info on-chain (getTokenInfo won't find custom devnet tokens)
      console.log('[DEBUG] Step 3: Fetching mint info on-chain...');
      const mintDataB = await getMint(connection, tokenMint, 'confirmed', TOKEN_2022_PROGRAM_ID);
      console.log('[DEBUG] Step 3 done. mintB decimals:', mintDataB.decimals);

      // Build ApiV3Token objects manually
      const mintInfoA = {
        chainId: 103,
        address: WSOL_MINT.toBase58(),
        programId: TOKEN_PROGRAM_ID.toBase58(),
        decimals: 9,
        symbol: 'WSOL',
        name: 'Wrapped SOL',
        logoURI: '',
        tags: [],
        extensions: {},
      };
      const mintInfoB = {
        chainId: 103,
        address: tokenMint.toBase58(),
        programId: TOKEN_2022_PROGRAM_ID.toBase58(),
        decimals: mintDataB.decimals,
        symbol: 'TOKEN',
        name: 'Token',
        logoURI: '',
        tags: [],
        extensions: {},
      };
      console.log('[DEBUG] mintInfoA:', mintInfoA, 'mintInfoB:', mintInfoB);

      console.log('[DEBUG] Step 4: Computing amounts...');
      const solAmountDecimal = new Decimal(solAmount).mul(LAMPORTS_PER_SOL).toDecimalPlaces(0).toFixed();
      const tokenAmountDecimal = new Decimal(tokenAmount).mul(new Decimal(10).pow(mintInfoB.decimals || 6)).toDecimalPlaces(0).toFixed();
      console.log('[DEBUG] solAmountDecimal:', solAmountDecimal, 'tokenAmountDecimal:', tokenAmountDecimal);

      console.log('[DEBUG] Step 5: Computing BN amounts...');
      const BN = (await import('bn.js')).default;
      const mintAAmount = new BN(solAmountDecimal);
      const mintBAmount = new BN(tokenAmountDecimal);
      console.log('[DEBUG] Step 5 done. mintAAmount:', mintAAmount.toString(), 'mintBAmount:', mintBAmount.toString());

      // Fetch CPMM fee configs from Raydium API
      console.log('[DEBUG] Step 5.5: Fetching CPMM configs...');
      const feeConfigs = await raydium.api.getCpmmConfigs();
      console.log('[DEBUG] CPMM configs:', feeConfigs);
      if (!feeConfigs || feeConfigs.length === 0) {
        throw new Error('No CPMM configs found. Raydium API may not support devnet configs.');
      }
      // Select config with 0.25% trade fee (2500 basis points) or fallback to first
      const feeConfig = feeConfigs.find(c => c.tradeFeeRate === 2500) || feeConfigs[0];
      console.log('[DEBUG] Selected feeConfig:', feeConfig);

      // Create CPMM pool
      console.log('[DEBUG] Step 6: Creating CPMM pool...');
      const { execute, extInfo } = await raydium.cpmm.createPool({
        programId: CPMM_PROGRAM_ID,
        poolFeeAccount: new PublicKey('DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8'), // devnet fee account
        mintA: mintInfoA,
        mintB: mintInfoB,
        mintAAmount,
        mintBAmount,
        startTime: new BN(0),
        feeConfig,
        associatedOnly: false,
        ownerInfo: {
          useSOLBalance: true,
        },
        txVersion: TxVersion.V0,
      });
      console.log('[DEBUG] Step 6 done.');

      console.log('[DEBUG] Step 7: Executing transaction...');
      const { txId } = await execute({ sendAndConfirm: true });
      console.log('[DEBUG] Step 7 done. txId:', txId);

      const poolId = extInfo?.address?.poolId?.toBase58?.() || 'N/A';

      toast.dismiss(loadingToast);
      toast.success('Liquidity pool created!', { duration: 5000 });

      setPoolResult({ txId, poolId });
      setMintAddress('');
      setSolAmount('');
      setTokenAmount('');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to create pool.', {
        id: loadingToast,
        duration: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[linear-gradient(135deg,_#0b0b1a_47%,_#a855f7_50%,_#0b0b1a_53%)] min-h-screen pt-28 px-4 md:px-16">
      <div className="bg-black/30 backdrop-blur-2xl border border-gray-800 rounded-3xl p-8 md:p-12 w-full max-w-4xl mx-auto shadow-xl flex flex-col items-center gap-10">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-white text-3xl md:text-4xl font-bold">
            Create Liquidity Pool
          </h1>
          <p className="text-gray-400 mt-3 text-sm md:text-base max-w-xl">
            Add your Token-2022 token to a <span className="text-purple-400 font-semibold">Raydium CPMM</span> pool paired with SOL on devnet.
            The ratio of SOL to tokens sets the initial token price.
          </p>
        </div>

        {/* Price preview */}
        {solAmount && tokenAmount && parseFloat(solAmount) > 0 && parseFloat(tokenAmount) > 0 && (
          <div className="w-full bg-purple-900/20 border border-purple-700/40 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Initial Price</p>
              <p className="text-white text-lg font-semibold mt-1">
                1 Token = {(parseFloat(solAmount) / parseFloat(tokenAmount)).toFixed(8)} SOL
              </p>
            </div>
            <div className="w-px h-10 bg-gray-700 hidden sm:block" />
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Pool Ratio</p>
              <p className="text-white text-lg font-semibold mt-1">
                {solAmount} SOL : {tokenAmount} Tokens
              </p>
            </div>
            <div className="w-px h-10 bg-gray-700 hidden sm:block" />
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Fee Tier</p>
              <p className="text-purple-400 text-lg font-semibold mt-1">0.25%</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="w-full flex flex-col gap-6">

          {/* Token Mint */}
          <div>
            <label className="text-white text-base md:text-lg font-semibold">
              <span className="text-red-500">*</span> Token Mint Address
            </label>
            <p className="text-gray-500 text-xs mt-1 mb-2">The Token-2022 mint you created</p>
            <input
              type="text"
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
              placeholder="e.g. 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
              className="w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
            />
          </div>

          {/* SOL + Token amounts side by side */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-500">*</span> SOL Amount
              </label>
              <p className="text-gray-500 text-xs mt-1 mb-2">Amount of SOL to deposit</p>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={solAmount}
                  onChange={(e) => setSolAmount(e.target.value)}
                  placeholder="0.1"
                  className="w-full bg-[#0D1117] text-white p-3 pr-14 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">SOL</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-500">*</span> Token Amount
              </label>
              <p className="text-gray-500 text-xs mt-1 mb-2">Amount of your token to deposit</p>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  placeholder="1000000"
                  className="w-full bg-[#0D1117] text-white p-3 pr-20 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">TOKEN</span>
              </div>
            </div>
          </div>

          {/* Wallet warning */}
          {!wallet.connected && (
            <p className="text-red-500 text-sm">Please connect your wallet to create a pool.</p>
          )}

          {/* Submit button */}
          <button
            onClick={handleCreatePool}
            disabled={loading || !wallet.connected}
            className={`w-full text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out
              ${loading || !wallet.connected
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
              }`}
          >
            {loading ? 'Creating Pool...' : '🚀 Create Liquidity Pool'}
          </button>
        </div>

        {/* Success result */}
        {poolResult && (
          <div className="w-full bg-green-900/20 border border-green-600/40 rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="text-green-400 text-xl font-semibold">🎉 Pool Created Successfully!</h2>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Pool ID</p>
              <p
                onClick={() => {
                  navigator.clipboard.writeText(poolResult.poolId);
                  toast.success('Pool ID copied!', { duration: 1500 });
                }}
                className="text-white text-sm mt-1 break-all cursor-pointer hover:text-purple-300 transition"
                title="Click to copy"
              >
                {poolResult.poolId}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  window.open(
                    `https://explorer.solana.com/tx/${poolResult.txId}?cluster=devnet`,
                    '_blank'
                  )
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                View Transaction
              </button>
              <button
                onClick={() =>
                  window.open(
                    `https://explorer.solana.com/address/${poolResult.poolId}?cluster=devnet`,
                    '_blank'
                  )
                }
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                View Pool
              </button>
            </div>
          </div>
        )}

        {/* Info box */}
        <div className="w-full text-xs text-gray-500 border border-gray-800 rounded-xl p-4 leading-relaxed">
          <p className="font-semibold text-gray-400 mb-1">ℹ️ How it works</p>
          <ul className="list-disc list-inside space-y-1">
            <li>A Raydium CPMM pool pairs your token with SOL.</li>
            <li>The SOL ÷ Token ratio you set becomes the <span className="text-gray-300">initial price</span>.</li>
            <li>A 0.25% swap fee is charged on each trade — earned by LP holders.</li>
            <li>You receive LP tokens representing your share of the pool.</li>
            <li>This runs on <span className="text-purple-400">Devnet</span> — no real funds are used.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default LiquidityPage;
