"use client";

import { useAccount, useReadContract } from "wagmi";
import { KEYDROP_ADDRESS, KEYDROP_ABI, MessageData } from "@/lib/contracts";
import { DashboardSummary } from "@/components/DashboardSummary";
import { SendMessageCard } from "@/components/SendMessageCard";
import { MessageFeed } from "@/components/MessageFeed";
import { AlertTriangle } from "lucide-react";

export default function Home() {
  const { address, isConnected } = useAccount();

  const isContractConfigured =
    Boolean(KEYDROP_ADDRESS) &&
    KEYDROP_ADDRESS !== "0x0000000000000000000000000000000000000000";

  // Read Sent Messages Count
  const {
    data: sentCount,
    isLoading: isLoadingSentCount,
    refetch: refetchSentCount,
  } = useReadContract({
    address: KEYDROP_ADDRESS,
    abi: KEYDROP_ABI,
    functionName: "getSentMessageCount",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && Boolean(address) && isContractConfigured,
    },
  });

  // Read Received Messages Count
  const {
    data: receivedCount,
    isLoading: isLoadingReceivedCount,
    refetch: refetchReceivedCount,
  } = useReadContract({
    address: KEYDROP_ADDRESS,
    abi: KEYDROP_ABI,
    functionName: "getReceivedMessageCount",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && Boolean(address) && isContractConfigured,
    },
  });

  // Read Sent Messages Array
  const {
    data: sentMessages,
    isLoading: isLoadingSentMsgs,
    refetch: refetchSentMsgs,
  } = useReadContract({
    address: KEYDROP_ADDRESS,
    abi: KEYDROP_ABI,
    functionName: "getSentMessages",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && Boolean(address) && isContractConfigured,
    },
  });

  // Read Received Messages Array
  const {
    data: receivedMessages,
    isLoading: isLoadingReceivedMsgs,
    refetch: refetchReceivedMsgs,
  } = useReadContract({
    address: KEYDROP_ADDRESS,
    abi: KEYDROP_ABI,
    functionName: "getReceivedMessages",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && Boolean(address) && isContractConfigured,
    },
  });

  const refetchAll = () => {
    refetchSentCount();
    refetchReceivedCount();
    refetchSentMsgs();
    refetchReceivedMsgs();
  };

  const isLoadingData =
    isLoadingSentCount ||
    isLoadingReceivedCount ||
    isLoadingSentMsgs ||
    isLoadingReceivedMsgs;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Contract Warning Banner if unconfigured */}
      {!isContractConfigured && (
        <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">
              Contract Address Not Configured
            </p>
            <p className="text-amber-200/90 leading-relaxed">
              Deploy the contract to BOT Chain Mainnet using{" "}
              <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-amber-300">
                npm run deploy:mainnet
              </code>{" "}
              and set{" "}
              <code className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-amber-300">
                NEXT_PUBLIC_CONTRACT_ADDRESS=&lt;address&gt;
              </code>{" "}
              in your <code className="bg-black/30 px-1.5 py-0.5 rounded">.env.local</code>{" "}
              file.
            </p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <DashboardSummary
        sentCount={sentCount}
        receivedCount={receivedCount}
        isLoading={isLoadingData}
      />

      {/* Send Message Form */}
      <SendMessageCard onMessageSent={refetchAll} />

      {/* Message Feed (Inbox & Sent) */}
      <MessageFeed
        receivedMessages={(receivedMessages as MessageData[]) || []}
        sentMessages={(sentMessages as MessageData[]) || []}
        isLoading={isLoadingData}
        onRefresh={refetchAll}
        isConnected={isConnected}
      />
    </main>
  );
}
