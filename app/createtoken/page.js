"use client"
import React, { useState } from 'react';

const Page = () => {
  const [showSocials, setShowSocials] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#100e24] to-black pt-28 px-4 md:px-16">
      <div className="bg-black border border-gray-800 rounded-3xl p-8 md:p-12 w-full max-w-4xl mx-auto shadow-xl flex flex-col items-center gap-10">
        <h1 className="text-white text-3xl md:text-4xl font-bold text-center">
          Create Your Token
        </h1>

        <div className="w-full flex flex-col gap-6">

          {/* Token Name & Symbol */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-600">*</span> Token Name
              </label>
              <input
                type="text"
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
                placeholder="Enter token symbol"
                className="mt-2 w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Decimals & Supply */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-600">*</span> Decimals
              </label>
              <input
                type="number"
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
                placeholder="Enter token supply"
                className="mt-2 w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Image & Description in one row */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-600">*</span> Token Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="mt-2 w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              />
            </div>
            <div className="flex-1">
              <label className="text-white text-base md:text-lg font-semibold">
                <span className="text-red-600">*</span> Description
              </label>
              <textarea
                placeholder="Enter token description"
                rows={4}
                className="mt-2 w-full bg-[#0D1117] text-white p-4 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              />
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center gap-4 mt-2">
            <label className="text-white font-semibold text-base md:text-lg">
              Show Socials
            </label>
            <div
              onClick={() => setShowSocials(!showSocials)}
              className={`w-14 h-8 flex items-center bg-gray-600 rounded-full p-1 cursor-pointer transition ${
                showSocials ? 'bg-purple-600' : 'bg-gray-500'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                  showSocials ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Social Fields (Conditional) */}
          {showSocials && (
            <div className="flex flex-col gap-4 w-full">
              <div>
                <label className="text-white text-base font-semibold">Twitter</label>
                <input
                  type="text"
                  placeholder="https://twitter.com/yourhandle"
                  className="mt-2 w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="text-white text-base font-semibold">Telegram</label>
                <input
                  type="text"
                  placeholder="https://t.me/yourchannel"
                  className="mt-2 w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="text-white text-base font-semibold">Website</label>
                <input
                  type="text"
                  placeholder="https://yourwebsite.com"
                  className="mt-2 w-full bg-[#0D1117] text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
