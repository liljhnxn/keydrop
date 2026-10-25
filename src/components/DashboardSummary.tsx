"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { botchainTestnet } from "@/lib/chains";
import { Send, Inbox, Globe, AlertCircle } from "lucide-react";

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

  const isCorrectNetwork = mounted && isConnected && chain?.id === botchainTestnet.id;
  const isWalletActive = mounted && isConnected;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            Network
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#343741]/40 flex items-center justify-center text-mutedText">
            <Globe className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          {!isWalletActive ? (
            <span className="text-sm text-mutedText">Not connected</span>
          ) : isCorrectNetwork ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-success shadow-sm shadow-success" />
              <p className="text-base font-semibold text-mainText">
                Botchain Testnet (968)
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-error" />
              <p className="text-base font-semibold text-error">Wrong Network</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
