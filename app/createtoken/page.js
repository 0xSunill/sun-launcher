
"use client";

import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createInitializeMetadataPointerInstruction, createInitializeMintInstruction, createMint, ExtensionType, getMinimumBalanceForRentExemptMint, getMintLen, LENGTH_SIZE, MINT_SIZE, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { uploadToPinata } from "@/utils/pinataUpload";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import Skeleton from "@/components/Skeleton";
const Page = () => {

  const router = useRouter();

  const [showSocials, setShowSocials] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [decimals, setDecimals] = useState("");
  const [supply, setSupply] = useState("");
  const [tokenImage, setTokenImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);

  const [mintAddress, setMintAddress] = useState(null);
  const [modal, setModal] = useState(false);
  const { connection } = useConnection();
  const wallet = useWallet();


  const [socialLinks, setSocialLinks] = useState({
    Twitter: "",
    Telegram: "",
    Website: ""
  });
  const [mintKeypairs, setMintKeypair] = useState(null);

  const isFormValid = tokenName && tokenSymbol && decimals && supply && tokenImage && description;



  const clickHandler = async () => {



    if (!wallet.connected) {
      toast.error("Connect your wallet first.");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Creating your token...");




    try {
      const metadataURI = await uploadToPinata(tokenImage, tokenName, tokenSymbol, description);
      console.log("Metadata uploaded to IPFS:", metadataURI);


      const mintKeypair = Keypair.generate();
      setMintKeypair(mintKeypair);
      const metadata = {

        mint: mintKeypair.publicKey,
        name: tokenName,
        symbol: tokenSymbol,
        uri: metadataURI,
        additionalMetadata: [["description", "Only Possible On Solana"]],
      };


      const mintLen = getMintLen([ExtensionType.MetadataPointer]);
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
      const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);


      const decimalsNumber = Number(decimals);
      if (isNaN(decimalsNumber) || decimalsNumber < 0 || decimalsNumber > 255) {
        alert("Decimals must be a number between 0 and 255.");
        return;
      }

      const transaction = new Transaction().add(

        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintLen,
          lamports,
          programId: TOKEN_2022_PROGRAM_ID,
        }),

        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),

        createInitializeMintInstruction(
          mintKeypair.publicKey,
          decimalsNumber,
          wallet.publicKey,
          wallet.publicKey,
          TOKEN_2022_PROGRAM_ID
        ),

        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          metadata: mintKeypair.publicKey,
          updateAuthority: wallet.publicKey,
          mint: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
        }),
      );


      transaction.feePayer = wallet.publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      transaction.partialSign(mintKeypair);

      await wallet.sendTransaction(transaction, connection);

      setMintAddress(mintKeypair.publicKey.toBase58());

      toast.dismiss(loadingToast);

      setModal(true);

     
    } catch (err) {
      toast.error(err.message || "Failed to create token", {
        id: loadingToast,
        duration: 10000,
      });
    } finally {
      setLoading(false);
      setTokenName("");
      setTokenSymbol("");
      setDecimals("");
      setSupply("");
      setTokenImage(null);
      setDescription("");

      setSocialLinks({
        Twitter: "",
        Telegram: "",
        Website: ""
      });
      setShowSocials(false);

    }




  }


  const handleMintToken = () => {
    if (!mintKeypairs) {
      alert("Mint Keypair not ready yet");
      return;
    }

    setSkeleton(true);
    router.push(`/minttoken?mint=${mintAddress}`);

  };


  const handleSocialChange = (e, platform) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: e.target.value,
    }));

  };


  return (

    <>
      {skeleton ? (
        <Skeleton />
      ) : (



        <div className="bg-[linear-gradient(135deg,_#0b0b1a_47%,_#a855f7_50%,_#0b0b1a_53%)]  pt-28 px-4 md:px-16  min-h-screen">



          {modal && (
            <div
              onClick={() => setModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            >
              <div
                onClick={(e) => e.stopPropagation()} // Prevent modal click from closing
                className="bg-[#1e1e2f] border border-purple-500 text-white px-2 py-6 rounded-2xl shadow-lg max-w-md w-[90%] text-center"
              >
                <h2 className="text-xl font-semibold mb-2">🎉 Token Created</h2>
                <p className="text-sm break-words mb-4">
                  <span className="font-semibold">Mint Address:</span><br />
                  {mintAddress}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center  gap-4">

                  <button
                    onClick={() => { window.open(`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`, "_blank"); setModal(false); }}
                    className="bg-blue-500 w-full hover:bg-blue-600  transition-colors duration-200 text-white font-semibold py-2 px-5 rounded-lg shadow-md mt-2"
                  >
                    View on Explorer
                  </button>


                  <button
                    onClick={handleMintToken}
                    className="bg-green-500 w-full hover:bg-green-600 transition-colors duration-200 text-white font-semibold py-2 px-5 rounded-lg shadow-md mt-2"
                  >
                    Mint Token
                  </button>
                </div>
              </div>
            </div>
          )}


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
                    min="0"
                    max="255"
                    step="1"
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

              <div className="mt-2 text-sm">
                {!wallet.connected && (
                  <p className="text-red-500">Please connect your wallet to create a token.</p>
                )}
              </div>

              <div className="w-full mt-2">
                <button
                  onClick={clickHandler}
                  className={`w-full text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out 
                ${!wallet.connected || !isFormValid || loading ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`}
                  disabled={!wallet.connected || !isFormValid || loading}
                >
                  {loading ? "Creating..." : "Create Token"}
                </button>
              </div>


              {mintAddress && (
                <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                  <div className="flex flex-col space-y-2">
                    <label className="text-green-400 font-semibold text-lg flex items-center">
                      🎉 Token Mint Address:
                    </label>

                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(mintAddress);
                        toast.success("Copied to clipboard!", {
                          duration: 1000,
                        });
                      }}

                      title="Click to copy"
                      className="cursor-pointer text-sm md:text-base text-white bg-gray-900 p-3 rounded break-words hover:bg-gray-700 transition"
                    >
                      {mintAddress}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center  gap-4">

                      <button
                        onClick={() => { window.open(`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`, "_blank"); setModal(false); }}
                        className="bg-blue-500 w-full hover:bg-blue-600  transition-colors duration-200 text-white font-semibold py-2 px-5 rounded-lg shadow-md mt-2"
                      >
                        View on Explorer
                      </button>


                      <button
                        onClick={handleMintToken}
                        className="bg-green-500 w-full hover:bg-green-600 transition-colors duration-200 text-white font-semibold py-2 px-5 rounded-lg shadow-md mt-2"
                      >
                        Mint Token
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default Page;
