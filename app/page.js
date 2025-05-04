
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

export default function Home() {
  return (
    <div className="px-4 md:px-20 pt-20 flex flex-col gap-10 bg-gradient-to-b from-[#100e24] to-[#000000]">
      
      <Hero />
   
    </div>
  );
}
