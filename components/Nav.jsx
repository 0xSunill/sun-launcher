"use client"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Nav = () => {
    const router = useRouter()
    return (
        <div className="bg-[#0D1117] border-b w-full h-20 px-4 md:px-20 flex justify-between items-center">
            <div className="text-white flex justify-center items-center text-[20px] md:text-3xl font-semibold">
                <div onClick={() => router.push('/')}>
                    <Image
                        src="/Images/logo.jpg"
                        alt="logo"
                        width={50}
                        height={50}
                        className="rounded-full object-cover aspect-square mr-2 "
                    />
                </div>
                Sun Launcher
            </div>
            <div className="flex-shrink-0">
                <WalletMultiButton />
            </div>
        </div>
    )
}

export default Nav