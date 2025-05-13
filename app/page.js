"use client"
import { useState } from "react"
import Features from "@/components/Features"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import Nav from "@/components/Nav"
import Skeleton from "@/components/Skeleton"
import Head from "next/head"

export default function Home() {
  const [loading, setLoading] = useState(false)

  return (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="flex flex-col gap-10 bg-gradient-to-b pt-20 from-[#100e24] to-[#000000]">
          <Nav />
          <Hero setLoading={setLoading} />
          <Features />
          <Footer />
        </div>
      )}
    </>
  )
}
