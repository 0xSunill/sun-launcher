"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Skeleton from './Skeleton'

const Hero = ({ setLoading }) => {
    const router = useRouter()


    const handleClick = () => {
        setLoading(true)
        setTimeout(() => {
            router.push('/createtoken')
        }, 1000)
    }


    const handleClickMint = () => {
        console.log("mint token route")
    }
    return (
        <div className='flex flex-1 py-16 px-4 md:px-20 pt-20 md:flex-row flex-col '>
            <div className='flex-1 flex  justify-center items-start flex-col gap-2  '>
                <h1 className='text-6xl font-bold text-white'>Create Your Solana <br />token</h1>
                <p className='text-lg text-gray-400 mt-4 mb-2 text-wrap max-w-[470px] '> Launch your own SPL token on the Solana blockchain in just a few clicks. No coding required. Fast, secure, and fully decentralized.</p>
                <div className='flex flex-row justify-start  items-center gap-4'>
                    <button
                        onClick={handleClick}
                        className="bg-purple-600  hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out">
                        Create Token
                    </button>
                    <button
                        onClick={handleClickMint}
                        className="bg-green-600 sm:ml-6 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-300 ease-in-out">
                        Create Token
                    </button>
                </div>
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