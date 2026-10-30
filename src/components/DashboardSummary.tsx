"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { botchain } from "@/lib/chains";
import { KEYDROP_ADDRESS } from "@/lib/contracts";
import { Send, Inbox, AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";

interface DashboardSummaryProps {
  sentCount: bigint | undefined;
  receivedCount: bigint | undefined;
  isLoading: boolean;
}

export function DashboardSummary({
  sentCount,
  receivedCount,
  isLoading,
}: DashboardSummaryProps) {
  const [mounted, setMounted] = useState(false);
  const { isConnected, chain } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isCorrectNetwork = mounted && isConnected && chain?.id === botchain.id;
  const isWalletActive = mounted && isConnected;

  const shortenAddress = (addr: string) => {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Messages Sent */}
      <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-mutedText uppercase tracking-wider">
            Messages Sent
          </span>
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Send className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          {!isWalletActive ? (
            <p className="text-sm text-mutedText">Connect wallet to view</p>
          ) : isLoading ? (
            <div className="h-8 w-16 bg-border/40 animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold text-mainText font-mono">
              {sentCount !== undefined ? sentCount.toString() : "0"}
            </p>
          )}
        </div>
      </div>

      {/* Messages Received */}
      <div className="bg-card border border-border rounded-2xl p-5 hover:border-secondary/40 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-mutedText uppercase tracking-wider">
            Messages Received
          </span>
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
            <Inbox className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          {!isWalletActive ? (
            <p className="text-sm text-mutedText">Connect wallet to view</p>
          ) : isLoading ? (
            <div className="h-8 w-16 bg-border/40 animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold text-mainText font-mono">
              {receivedCount !== undefined ? receivedCount.toString() : "0"}
            </p>
          )}
        </div>
      </div>

      {/* Network */}
      <div className="bg-card border border-border rounded-2xl p-5 hover:border-border/80 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-mutedText uppercase tracking-wider">
            Active Network
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#15171C] border border-border flex items-center justify-center">
            <img
              src="/botchain-logo.png"
              alt="BOT Chain"
              className="w-4 h-4 object-contain rounded shrink-0"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          {!isWalletActive ? (
            <div className="flex items-center space-x-2">
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-4 h-4 object-contain rounded shrink-0"
              />
              <span className="text-sm text-mutedText">BOT Chain (677)</span>
            </div>
          ) : isCorrectNetwork ? (
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-success shadow-sm shadow-success shrink-0" />
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-4 h-4 object-contain rounded shrink-0"
              />
              <p className="text-sm font-semibold text-mainText truncate">
                BOT Chain (677)
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-error shrink-0" />
              <p className="text-sm font-semibold text-error">Wrong Network</p>
            </div>
          )}
        </div>
      </div>

      {/* Mainnet Contract Address */}
      <div className="bg-card border border-border rounded-2xl p-5 hover:border-emerald-500/40 transition-all duration-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-mutedText uppercase tracking-wider">
            Mainnet Contract
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <a
            href={`https://scan.botchain.ai/address/${KEYDROP_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between text-xs font-mono bg-[#15171C] border border-border hover:border-emerald-500/40 px-3 py-2 rounded-xl text-emerald-400 transition-colors"
          >
            <div className="flex items-center space-x-2 truncate">
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-3.5 h-3.5 object-contain rounded shrink-0"
              />
              <span className="font-semibold">{shortenAddress(KEYDROP_ADDRESS)}</span>
            </div>
            <ExternalLink className="w-3 h-3 text-mutedText group-hover:text-emerald-400 shrink-0 ml-1.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
