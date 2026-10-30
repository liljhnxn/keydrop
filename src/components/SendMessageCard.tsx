"use client";

import { useState, useMemo, useEffect } from "react";
import { isAddress } from "viem";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { KEYDROP_ADDRESS, KEYDROP_ABI } from "@/lib/contracts";
import { botchain } from "@/lib/chains";
import {
  Send,
  AlertTriangle,
  Loader2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from "lucide-react";

interface SendMessageCardProps {
  onMessageSent: () => void;
}

export function SendMessageCard({ onMessageSent }: SendMessageCardProps) {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWalletActive = mounted && isConnected;

  const {
    data: txHash,
    error: writeError,
    isPending: isWritePending,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Calculate byte length strictly using UTF-8
  const byteLength = useMemo(() => {
    return new TextEncoder().encode(content).length;
  }, [content]);

  const isOverByteLimit = byteLength > 280;
  const isCorrectNetwork = isConnected && chain?.id === botchain.id;
  const isPending = isWritePending || isConfirming;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isConnected) {
      setValidationError("Please connect your wallet first.");
      return;
    }

    if (!isCorrectNetwork) {
      setValidationError("Please switch to Botchain Mainnet.");
      return;
    }

    const trimmedRecipient = recipient.trim();
    if (!trimmedRecipient || !isAddress(trimmedRecipient)) {
      setValidationError("Please provide a valid Ethereum wallet address (0x...).");
      return;
    }

    if (trimmedRecipient.toLowerCase() === "0x0000000000000000000000000000000000000000") {
      setValidationError("Cannot send messages to the zero address.");
      return;
    }

    if (address && trimmedRecipient.toLowerCase() === address.toLowerCase()) {
      setValidationError("You cannot send a message to your own address.");
      return;
    }

    if (!content.trim()) {
      setValidationError("Message content cannot be empty.");
      return;
    }

    if (isOverByteLimit) {
      setValidationError(
        `Message exceeds 280 bytes limit (current: ${byteLength} bytes).`
      );
      return;
    }

    if (!KEYDROP_ADDRESS || KEYDROP_ADDRESS === "0x0000000000000000000000000000000000000000") {
      setValidationError(
        "KeyDrop smart contract address is not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local."
      );
      return;
    }

    writeContract(
      {
        address: KEYDROP_ADDRESS,
        abi: KEYDROP_ABI,
        functionName: "sendMessage",
        args: [trimmedRecipient as `0x${string}`, content],
      },
      {
        onSuccess: () => {
          setContent("");
          // Refetch data after confirmation
        },
      }
    );
  };

  // Trigger parent refresh when transaction is confirmed
  if (isConfirmed) {
    onMessageSent();
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xl mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Send className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-mainText">Send a Message</h2>
          <p className="text-xs text-mutedText">
            Broadcast a public message to any wallet address on-chain.
          </p>
        </div>
      </div>

      {/* Prominent Public Ledger Warning */}
      <div className="mb-6 bg-[#15171C] border border-amber-500/30 rounded-xl p-3.5 flex items-start space-x-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 font-semibold block mb-0.5">
            Public Blockchain Notice:
          </strong>
          Messages are permanently recorded on a public blockchain. Anyone may be able
          to read them. Never send passwords, private keys, financial secrets, or
          sensitive personal information.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Address */}
        <div>
          <label className="block text-xs font-semibold text-mutedText uppercase tracking-wider mb-2">
            Recipient Wallet Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => {
              setRecipient(e.target.value);
              setValidationError(null);
            }}
            disabled={!isWalletActive || isPending}
            className="w-full bg-[#15171C] border border-border rounded-xl px-4 py-2.5 text-sm text-mainText placeholder-mutedText/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50 font-mono"
          />
        </div>

        {/* Message Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-mutedText uppercase tracking-wider">
              Message Content
            </label>
            <span
              className={`text-xs font-mono font-medium ${
                isOverByteLimit ? "text-error" : "text-mutedText"
              }`}
            >
              {byteLength} / 280 bytes
            </span>
          </div>
          <textarea
            rows={3}
            placeholder="Hey! Check out my new Web3 project."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setValidationError(null);
            }}
            disabled={!isWalletActive || isPending}
            className={`w-full bg-[#15171C] border rounded-xl px-4 py-3 text-sm text-mainText placeholder-mutedText/50 focus:outline-none transition-colors resize-none disabled:opacity-50 ${
              isOverByteLimit ? "border-error focus:border-error" : "border-border focus:border-primary"
            }`}
          />
        </div>

        {/* Validation or Blockchain Errors */}
        {validationError && (
          <div className="flex items-center space-x-2 text-xs text-error bg-error/10 border border-error/20 rounded-xl p-3">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {(writeError || confirmError) && (
          <div className="flex items-start space-x-2 text-xs text-error bg-error/10 border border-error/20 rounded-xl p-3">
            <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="break-all">
              {writeError?.message?.includes("User rejected")
                ? "Transaction was rejected in your wallet."
                : writeError?.message || confirmError?.message || "Transaction failed."}
            </span>
          </div>
        )}

        {/* Transaction Confirmation Status */}
        {txHash && (
          <div className="bg-[#15171C] border border-border rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-mutedText">Transaction Status:</span>
              {isConfirming && (
                <span className="flex items-center space-x-1.5 text-primary">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Confirming on Botchain...</span>
                </span>
              )}
              {isConfirmed && (
                <span className="flex items-center space-x-1.5 text-success font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmed on-chain!</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs font-mono bg-card px-3 py-1.5 rounded-lg border border-border/50">
              <span className="text-mutedText truncate mr-2">
                Hash: {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </span>
              <a
                href={`${botchain.blockExplorers.default.url}/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-primary hover:underline shrink-0"
              >
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-3.5 h-3.5 object-contain rounded shrink-0"
                />
                <span>View on Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isWalletActive ? (
          <div className="bg-[#15171C] border border-border rounded-xl p-4 text-center">
            <p className="text-xs text-mutedText mb-3">
              Connect your crypto wallet to send public on-chain messages.
            </p>
            <span className="inline-block px-4 py-2 text-xs font-semibold rounded-lg bg-card text-mutedText border border-border">
              Wallet Disconnected
            </span>
          </div>
        ) : (
          <button
            type="submit"
            disabled={
              isPending ||
              isOverByteLimit ||
              !recipient ||
              !content.trim() ||
              !isCorrectNetwork
            }
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.99] text-background font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {isWritePending
                    ? "Awaiting Wallet Signature..."
                    : "Confirming Transaction..."}
                </span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Message On-Chain</span>
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
}
