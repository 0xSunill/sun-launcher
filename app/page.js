
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" flex flex-col gap-10 bg-gradient-to-b from-[#100e24] to-[#000000]">

      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
