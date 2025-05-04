
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <Nav />
      <Hero />
    </div>
  );
}
