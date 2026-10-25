# KeyDrop — A Simple Web3 Messaging dApp

**KeyDrop** is a decentralized, public messaging application built for **Botchain Testnet (Chain ID 968)**. It enables users to connect their crypto wallets, send lightweight on-chain messages to any wallet address, and view their sent and received messages directly from the smart contract.

> **⚠️ Public Data Warning:** All messages sent through KeyDrop are permanently written to an immutable public blockchain. Messages are NOT encrypted or private. Anyone can view them. **Never send passwords, seed phrases, private keys, financial credentials, or sensitive personal information.**

---

## 🚀 Features

- **Decentralized Messaging:** Zero centralized servers, databases, or traditional accounts.
- **Botchain Testnet Native:** Pre-configured for Botchain Testnet (`Chain ID 968`, `BOT` native currency).
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
- **MetaMask or Web3 Wallet** with Botchain Testnet configured
- **Testnet BOT tokens** for gas fees on Botchain Testnet

---

## ⚙️ Botchain Testnet Details

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Currency Symbol** | `BOT` |
| **Currency Decimals** | `18` |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |

---

## 📦 Installation & Setup

1. **Clone or navigate to the repository:**
   ```bash
   cd Keydrop
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   # Botchain Testnet RPC
   BOTCHAIN_RPC_URL=https://rpc.bohr.life
   NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.bohr.life

   # KeyDrop Deployed Smart Contract Address (fill after deployment)
   NEXT_PUBLIC_CONTRACT_ADDRESS=

   # Private Key for Hardhat Deployment (do NOT prefix with NEXT_PUBLIC_)
   PRIVATE_KEY=your_private_key_here
   ```

---

## 🧪 Smart Contract Compilation & Testing

To compile the smart contract:
```bash
npm run compile
```

To run the complete test suite (15 required test cases + batch helpers):
```bash
npm run test
```

### Test Suite Covers:
1. Contract deploys successfully
2. Initial message count is zero
3. Users can send messages
4. Sender address is recorded correctly
5. Recipient address is recorded correctly
6. Message content is stored accurately
7. Block timestamp is recorded
8. Message IDs increment sequentially
9. Sent-message array indexes are accurate
10. Received-message array indexes are accurate
11. Empty messages are rejected
12. Messages exceeding 280 UTF-8 bytes are rejected (including multibyte characters)
13. Zero address cannot receive messages
14. Sending a message to one's own wallet is rejected
15. `MessageSent` event is emitted with all expected arguments

---

## 🚀 Deploying to Botchain Testnet

1. Ensure your deployer account has testnet `BOT` tokens.
2. Put the deployer's private key into `.env.local`:
   ```env
   PRIVATE_KEY=0x...
   ```
3. Run the deployment script:
   ```bash
   npm run deploy:botchain
   ```
4. Copy the logged contract address and update `.env.local`:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
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
   - `NEXT_PUBLIC_BOTCHAIN_RPC_URL`: `https://rpc.bohr.life`
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: `<Your deployed contract address>`
4. Click **Deploy**.

---

## 🔍 Tracking Transactions on the Block Explorer

Every message sent triggers a transaction on Botchain Testnet. You can view transaction hashes, gas fees, and block confirmations on:
[https://scan.bohr.life](https://scan.bohr.life)

Simply search for:
- Your wallet address
- The KeyDrop contract address
- The transaction hash displayed in the KeyDrop UI after sending a message

---

## 🛡️ Security & Blockchain Privacy

- **Public Ledger:** Smart contract storage on EVM blockchains is globally readable. Anyone running a node or using a block explorer can inspect message payloads.
- **No Deletion:** Blockchain state is permanent; messages cannot be edited or deleted once confirmed.
- **Zero Secrets:** Never use KeyDrop to transmit passwords, private keys, API secrets, or confidential personal information.
