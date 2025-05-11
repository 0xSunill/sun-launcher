"use client";
import React, { useState } from "react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType } from "@solana/spl-token"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

const Page = () => {
  const [showSocials, setShowSocials] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const [supply, setSupply] = useState("");
  const [tokenImage, setTokenImage] = useState(null);
  const [description, setDescription] = useState("");




  const [socialLinks, setSocialLinks] = useState({
    Twitter: "",
    Telegram: "",
    Website: ""
  });

  const isFormValid = tokenName && tokenSymbol && decimals && supply && tokenImage && description;
  const { connection } = useConnection();
  const wallet = useWallet();
  const clickHandler = async () => {





    if (!connected) {


      const mintKeypair = Keypair.generate();
      const metadata = {
        mint: mintKeypair.publicKey,
        name: tokenName,
        symbol: tokenSymbol,
        uri: `https://example.com/${tokenName}.json`,
        additionalMetadata: [],
      };

      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

      const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

      const transaction = new Transaction().add(

        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),

        createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
        createInitializeMintInstruction(mintKeypair.publicKey, decimals, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        }),
      );

      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.partialSign(mintKeypair);

      await wallet.sendTransaction(transaction, connection);



      console.log("Token Created:", {
        tokenName,
        tokenSymbol,
        decimals,
        supply,
        tokenImage,
        description,
        socialLinks: showSocials ? socialLinks : {}
      });

    }
  }
  const handleSocialChange = (e, platform) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: e.target.value,
    }));
  };


  return (
    <div className="bg-[linear-gradient(135deg,_#0b0b1a_47%,_#a855f7_50%,_#0b0b1a_53%)]  pt-28 px-4 md:px-16">
      <div className="bg-black/30 backdrop-blur-2xl border border-gray-800 rounded-3xl p-8 md:p-12 w-full max-w-4xl mx-auto shadow-xl flex flex-col items-center gap-10">
        <h1 className="text-white text-3xl md:text-4xl font-bold text-center">
          Create Your Token
        </h1>

        <div className="w-full flex flex-col gap-6">

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-600">*</span> Token Name
              </label>
              <input
                type="text"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="Enter token name"
                className="mt-2 w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-600">*</span> Token Symbol
              </label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value)}
                placeholder="Enter token symbol"
                className="mt-2 w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-600">*</span> Decimals
              </label>
              <input
                type="number"
                value={decimals}
                onChange={(e) => setDecimals(e.target.value)}
                placeholder="Enter token decimals"
                className="mt-2 w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-600">*</span> Supply
              </label>
              <input
                type="number"
                value={supply}
                onChange={(e) => setSupply(e.target.value)}
                placeholder="Enter token supply"
                className="mt-2 w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-600">*</span> Token Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setTokenImage(e.target.files[0])}
                className="mt-2 w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              />
            </div>
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-600">*</span> Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter token description"
                rows={4}
                className="mt-2 w-full bg-[#0D1117] text-white p-4 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <label className="text-white font-semibold text-base md:text-lg">
              Show Socials
            </label>
            <div
              onClick={() => setShowSocials(!showSocials)}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${showSocials ? "bg-purple-600" : "bg-gray-500"
                }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${showSocials ? "translate-x-6" : "translate-x-0"
                  }`}
              />
            </div>
          </div>

          {showSocials && (
            <div className="flex flex-col gap-4 w-full">
              {["Twitter", "Telegram", "Website"].map((platform) => (
                <div key={platform}>
                  <label className="text-white text-base font-semibold">
                    {platform}
                  </label>
                  <input
                    type="text"
                    onChange={(e) => handleSocialChange(e, platform)}
                    placeholder={`https://${platform.toLowerCase()}.com/yourhandle`}
                    className="mt-2 w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 text-sm">
            {!connected && (
              <p className="text-red-500">Please connect your wallet to create a token.</p>
            )}
          </div>

          <div className="w-full mt-4">
            <button
              onClick={clickHandler}
              className={`w-full text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out 
                ${!connected || !isFormValid ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
              disabled={!connected || !isFormValid}
            >
              Create Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
