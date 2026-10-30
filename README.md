# KeyDrop — A Simple Web3 Messaging dApp

**KeyDrop** is a decentralized, public messaging application built for **BOT Chain (Chain ID 677)**. It enables users to connect their crypto wallets, send lightweight on-chain messages to any wallet address, and view their sent and received messages directly from the smart contract.

> **⚠️ Public Data Warning:** All messages sent through KeyDrop are permanently written to an immutable public blockchain. Messages are NOT encrypted or private. Anyone can view them. **Never send passwords, seed phrases, private keys, financial credentials, or sensitive personal information.**

---

## 🚀 Features

- **Decentralized Messaging:** Zero centralized servers, databases, or traditional accounts.
- **BOT Chain Native:** Configured for BOT Chain Mainnet (`Chain ID 677`, `BOT` native currency).
- **Wallet Connection:** Clean injected wallet support (MetaMask, Rabby, Brave, Coinbase Wallet).
- **On-Chain Message Registry:** Real-time contract reads for sent messages, received inbox messages, and message counts.
- **Strict Validation:** Rejects zero addresses, self-messages, empty messages, and messages exceeding 280 UTF-8 bytes.
- **Modern Sleek UI:** Built with Next.js 15, Tailwind CSS, Lucide icons, and responsive layouts.
- **Full Test Coverage:** 15 comprehensive unit tests covering all smart contract specifications.

---

## 🛠️ Technology Stack

- **Smart Contract:** Solidity `^0.8.20`
- **Development & Testing:** Hardhat, ethers.js v6, Chai matchers
- **Frontend Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS (Custom Dark Palette)
- **Web3 Interaction:** wagmi v2, viem, TanStack React Query v5

---

## 📋 Prerequisites

- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher
- **MetaMask or Web3 Wallet** with BOT Chain configured
- **BOT tokens** for gas fees on BOT Chain

---

## ⚙️ BOT Chain Network Details

| Parameter | Value |
| :--- | :--- |
| **Network Name** | BOT Chain |
| **Chain ID** | `677` |
| **RPC URL** | `https://rpc.botchain.ai` |
| **Official Website** | [https://botchain.ai](https://botchain.ai) |
| **Currency Symbol** | `BOT` |
| **Currency Decimals** | `18` |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Deployed Contract** | [`0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2`](https://scan.botchain.ai/address/0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2) |

---

## 📦 Installation & Setup

1. **Clone or navigate to the repository:**
   ```bash
   cd Keydrop
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Ensure `.env.local` has:
   ```env
   BOTCHAIN_RPC_URL=https://rpc.botchain.ai
   NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.botchain.ai
   NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL=https://scan.botchain.ai
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2
   PRIVATE_KEY=<your_private_key>
   ```

---

## 🚀 Smart Contract Deployment

1. Compile the contract:
   ```bash
   npm run compile
   ```
2. Deploy to BOT Chain:
   ```bash
   npm run deploy:mainnet
   ```

---

## 💻 Running the Frontend Locally

Start the Next.js development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000`.

To create a production build and test it:
```bash
npm run build
npm run start
```

---

## 🌐 Deploying Frontend to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into [Vercel](https://vercel.com).
3. In the Vercel Project Settings, add the Environment Variables:
   - `NEXT_PUBLIC_BOTCHAIN_RPC_URL`: `https://rpc.botchain.ai`
   - `NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL`: `https://scan.botchain.ai`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: `0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2`
4. Click **Deploy**.

---

## 🔍 Tracking Transactions on the Block Explorer

Every message sent triggers a transaction on BOT Chain. You can view transaction hashes, gas fees, and block confirmations on:
[https://scan.botchain.ai](https://scan.botchain.ai)

---

## 🛡️ Security & Blockchain Privacy

- **Public Ledger:** Smart contract storage on EVM blockchains is globally readable. Anyone running a node or using a block explorer can inspect message payloads.
- **No Deletion:** Blockchain state is permanent; messages cannot be edited or deleted once confirmed.
- **Zero Secrets:** Never use KeyDrop to transmit passwords, private keys, API secrets, or confidential personal information.
