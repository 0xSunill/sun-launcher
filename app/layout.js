import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sun launcher",
  description: "a solana token launcher",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWalletProvider>
          <Nav />
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
