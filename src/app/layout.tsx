import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "KeyDrop — Public Web3 Messaging on Botchain Testnet",
  description:
    "Send public on-chain messages to any wallet address on Botchain Testnet. Drop a message. Send it on-chain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="bg-background text-mainText min-h-screen flex flex-col antialiased selection:bg-primary/30 selection:text-primary"
      >
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
