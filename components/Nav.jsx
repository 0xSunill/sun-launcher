"use client"

import WalletMultiButton from './WalletButton' 

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const Nav = () => {
    const router = useRouter()
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-gray-800 h-20 px-4 md:px-20 flex justify-between items-center">
            <div
                className="text-white flex justify-center items-center text-[20px] md:text-3xl font-semibold cursor-pointer"
                onClick={() => router.push('/')}
            >
                <Image
                    src="/Images/logo.jpg"
                    alt="logo"
                    width={50}
                    height={50}
                    className="rounded-full object-cover aspect-square mr-2"
                />
                <span className="hidden md:inline text-white text-2xl font-bold  ml-2">
                    Sun Launcher
                </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
                <Link href="/createtoken" className="text-gray-300 hover:text-purple-400 transition text-sm font-medium">
                    Create Token
                </Link>
                <Link href="/minttoken" className="text-gray-300 hover:text-purple-400 transition text-sm font-medium">
                    Mint Token
                </Link>
                <Link href="/liquidity" className="text-gray-300 hover:text-purple-400 transition text-sm font-medium">
                    Liquidity Pool
                </Link>
            </nav>

            <div className="flex-shrink-0">
                <WalletMultiButton />
            </div>
        </div>
    )
}

export default Nav
