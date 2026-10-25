"use client";

import { useState, useEffect } from "react";
import { MessageData } from "@/lib/contracts";
import {
  Inbox,
  Send,
  Copy,
  Check,
  Calendar,
  Hash,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface MessageFeedProps {
  receivedMessages: MessageData[];
  sentMessages: MessageData[];
  isLoading: boolean;
  onRefresh: () => void;
  isConnected: boolean;
}

export function MessageFeed({
  receivedMessages,
  sentMessages,
  isLoading,
  onRefresh,
  isConnected,
}: MessageFeedProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"inbox" | "sent">("inbox");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const shortenAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimestamp = (ts: bigint) => {
    if (!ts) return "Unknown";
    const date = new Date(Number(ts) * 1000);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Sort newest first
  const sortedReceived = [...receivedMessages].sort((a, b) =>
    Number(b.timestamp - a.timestamp)
  );
  const sortedSent = [...sentMessages].sort((a, b) =>
    Number(b.timestamp - a.timestamp)
  );

  const currentList = activeTab === "inbox" ? sortedReceived : sortedSent;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl mb-12">
      {/* Header and Tab Selection */}
      <div className="border-b border-border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#1a1d24]">
        <div className="flex items-center space-x-2">
          {/* Inbox Tab */}
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === "inbox"
                ? "bg-secondary text-background shadow-md shadow-secondary/20"
                : "bg-background/60 text-mutedText hover:text-mainText border border-border"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Inbox</span>
            <span
              className={`ml-1 px-1.5 py-0.2 text-[11px] rounded-full font-mono ${
                activeTab === "inbox"
                  ? "bg-background/20 text-background"
                  : "bg-border/60 text-mutedText"
              }`}
            >
              {receivedMessages.length}
            </span>
          </button>

          {/* Sent Tab */}
          <button
            onClick={() => setActiveTab("sent")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              activeTab === "sent"
                ? "bg-primary text-background shadow-md shadow-primary/20"
                : "bg-background/60 text-mutedText hover:text-mainText border border-border"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent</span>
            <span
              className={`ml-1 px-1.5 py-0.2 text-[11px] rounded-full font-mono ${
                activeTab === "sent"
                  ? "bg-background/20 text-background"
                  : "bg-border/60 text-mutedText"
              }`}
            >
              {sentMessages.length}
            </span>
          </button>
        </div>

        {/* Refresh Button */}
        {mounted && isConnected && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="self-end sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-cardHover text-xs text-mutedText hover:text-mainText transition-colors disabled:opacity-50"
            title="Refresh on-chain messages"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6">
        {!mounted || !isConnected ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-2xl bg-border/40 text-mutedText flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-mainText mb-1">
              Connect Wallet to View Messages
            </h3>
            <p className="text-xs text-mutedText max-w-sm mx-auto">
              You need to connect your wallet to retrieve your on-chain inbox and
              sent history from the smart contract.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-mutedText space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-xs">Reading messages from Botchain Testnet...</p>
          </div>
        ) : currentList.length === 0 ? (
          <div className="text-center py-14 px-4">
            <div className="w-12 h-12 rounded-2xl bg-[#15171C] border border-border text-mutedText flex items-center justify-center mx-auto mb-3">
              {activeTab === "inbox" ? (
                <Inbox className="w-6 h-6 text-secondary/60" />
              ) : (
                <Send className="w-6 h-6 text-primary/60" />
              )}
            </div>
            <p className="text-sm font-medium text-mainText">
              {activeTab === "inbox"
                ? "No messages yet. Messages sent to your wallet will appear here."
                : "You haven't sent any messages yet."}
            </p>
            <p className="text-xs text-mutedText mt-1">
              All messages are recorded directly on Botchain Testnet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentList.map((msg) => {
              const targetAddress =
                activeTab === "inbox" ? msg.sender : msg.recipient;
              const isInbox = activeTab === "inbox";

              return (
                <div
                  key={msg.id.toString()}
                  className="bg-[#15171C] border border-border hover:border-border/80 rounded-xl p-4 sm:p-5 transition-all duration-200"
                >
                  {/* Top Bar of Message */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-border/50 text-xs">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-medium ${
                          isInbox
                            ? "bg-secondary/10 text-secondary border border-secondary/20"
                            : "bg-primary/10 text-primary border border-primary/20"
                        }`}
                      >
                        {isInbox ? (
                          <>
                            <ArrowDownLeft className="w-3 h-3" />
                            <span>From</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3 h-3" />
                            <span>To</span>
                          </>
                        )}
                      </span>

                      <span className="font-mono text-mainText font-semibold">
                        {shortenAddress(targetAddress)}
                      </span>

                      <button
                        onClick={() => handleCopy(targetAddress)}
                        className="p-1 hover:bg-card rounded text-mutedText hover:text-mainText transition-colors"
                        title="Copy full address"
                      >
                        {copiedAddress === targetAddress ? (
                          <Check className="w-3.5 h-3.5 text-success" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center space-x-3 text-mutedText text-[11px]">
                      <span className="flex items-center space-x-1 font-mono">
                        <Hash className="w-3 h-3 text-mutedText/70" />
                        <span>ID #{msg.id.toString()}</span>
                      </span>

                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-mutedText/70" />
                        <span>{formatTimestamp(msg.timestamp)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="text-sm text-mainText whitespace-pre-wrap leading-relaxed break-words py-1">
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
