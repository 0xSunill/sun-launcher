"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Hero = () => {
    const router = useRouter()
    return (
        <div className='flex flex-1 py-16  md:flex-row flex-col px-4 md:px-20 bg-gradient-to-b from-[#100e24] to-[#000000]'>
            <div className='flex-1 flex  justify-center items-start flex-col gap-2  '>
                <h1 className='text-6xl font-bold text-white'>Create Your Solana <br />token</h1>
                <p className='text-lg text-gray-400 mt-4 mb-2 text-wrap max-w-[470px] '> Launch your own SPL token on the Solana blockchain in just a few clicks. No coding required. Fast, secure, and fully decentralized.</p>
                <button
                onClick={() => router.push('/createtoken')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out">
                    Create Token
                </button>
            </div>
            <div className=''>
                <Image
                    src="/Images/hero2.jpg"
                    alt="robot"
                    width={550}
                    height={550}
                    className="rounded-4xl relative z-[5] p-3 mt-8 sm:mt-0 flex-row-reverse  "
                />
            </div>
        </div>
    )
}

export default Hero