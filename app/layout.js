import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/components/AppWalletProvider";
import Nav from "@/components/Nav";
import { Toaster } from "react-hot-toast";
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
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1e1e2f",
              color: "#ffffff",
              border: "1px solid #a855f7",
              padding: "16px",
              borderRadius: "12px",
            },
            success: {
              duration: 10000,
              iconTheme: {
                primary: "#4ade80",
                secondary: "#1e1e2f",
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: "#f87171",
                secondary: "#1e1e2f",
              },
            },
          }}
        />
        <AppWalletProvider>
          <Nav />
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
