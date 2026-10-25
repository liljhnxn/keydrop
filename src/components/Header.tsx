"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/lib/chains";
import {
  MessageSquare,
  Wallet,
  LogOut,
  Copy,
  Check,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWrongNetwork = mounted && isConnected && chain?.id !== botchainTestnet.id;

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <header className="border-b border-border bg-[#15171C]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo and Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-lg shadow-primary/20">
            <div className="w-full h-full bg-[#15171C] rounded-[10px] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-mainText">
                KeyDrop
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full">
                Testnet
              </span>
            </div>
            <p className="text-xs text-mutedText hidden sm:block">
              Drop a message. Send it on-chain.
            </p>
          </div>
        </div>

        {/* Right Action / Wallet Button */}
        <div className="flex items-center space-x-3">
          {!mounted ? (
            <button
              disabled
              className="flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary text-background opacity-80 cursor-default"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          ) : isConnected && isWrongNetwork ? (
            <button
              onClick={() => switchChain({ chainId: botchainTestnet.id })}
              disabled={isSwitching}
              className="flex items-center space-x-2 px-3.5 py-2 text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/20 transition-all duration-200"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isSwitching ? "Switching..." : "Switch to Botchain"}</span>
            </button>
          ) : isConnected ? (
            <>
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-card border border-border rounded-xl text-xs text-mutedText">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span>Botchain Testnet (968)</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 px-4 py-2 bg-card hover:bg-cardHover border border-border rounded-xl text-sm font-medium text-mainText transition-all duration-200"
                >
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span>{address ? shortenAddress(address) : ""}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-mutedText" />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 p-2 space-y-1">
                      <div className="px-3 py-2 border-b border-border text-xs text-mutedText">
                        Connected Address
                        <p className="font-mono text-mainText truncate text-xs mt-0.5">
                          {address}
                        </p>
                      </div>

                      <button
                        onClick={handleCopy}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-mainText hover:bg-background rounded-lg transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-success" />
                            <span className="text-success">Address Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-mutedText" />
                            <span>Copy Full Address</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          disconnect();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Disconnect Wallet</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="flex items-center space-x-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary text-background hover:bg-primary-hover active:scale-95 transition-all duration-200 shadow-md shadow-primary/20 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
