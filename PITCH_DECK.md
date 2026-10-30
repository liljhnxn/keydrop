# KeyDrop — Pitch Deck

**Decentralized, Serverless Web3 Messaging on BOT Chain**

---

### Slide 1: Cover
* **Title:** KeyDrop 🗝️✉️
* **Subtitle:** Serverless, Censorship-Resistant On-Chain Messaging
* **Network:** BOT Chain Mainnet (Chain ID: `677`)
* **Tagline:** *"Your wallet is your identity. Your inbox is on-chain."*
* **Links:**
  * BOT Chain Website: [botchain.ai](https://botchain.ai)
  * Smart Contract: [`0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2`](https://scan.botchain.ai/address/0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2)
  * Block Explorer: [scan.botchain.ai](https://scan.botchain.ai)

---

### Slide 2: The Problem
* **Centralized Gatekeepers:** Modern messaging (WhatsApp, Telegram, Discord, X) relies entirely on centralized servers that can ban accounts, censor content, or shut down access arbitrarily.
* **Ephemeral & Mutable Records:** Centralized databases can edit, delete, or re-order message histories silently without user consent.
* **Surveillance Capitalism:** Traditional platforms harvest user phone numbers, IP addresses, emails, and social graphs.
* **Web3 Identity Mismatch:** Web3 users conduct transactions using wallet addresses, but currently have no simple, native way to send notifications, attestations, or messages directly to a counterparty wallet address.

---

### Slide 3: The Insight
* **Wallets are the universal identity layer of the future.**
* Every decentralized finance trader, NFT collector, and DAO participant has a public address.
* They don't need another proprietary app requiring email/phone registration.
* **They need a trustless communication channel that writes directly to the blockchain state machine.**

---

### Slide 4: The Solution — KeyDrop
* **100% Serverless:** Zero backend APIs, zero cloud databases, zero proprietary server maintenance.
* **Pure On-Chain Delivery:** Messages are written directly into smart contract storage with permanent block finality.
* **Native EVM Integration:** Send a message to any valid EVM wallet address as easily as transferring tokens.
* **Dual-Indexed Inboxes:** Instantly query all messages sent by or received by any wallet directly from the node RPC.

---

### Slide 5: How It Works
1. **Connect:** User connects their Web3 wallet (MetaMask, Rabby, Coinbase Wallet) via Wagmi v2.
2. **Compose:** Input recipient wallet address and type up to 280 UTF-8 characters.
3. **Dispatch:** Sign the EVM transaction on BOT Chain.
4. **Permanent Record:** Contract validates input, increments total counter, indexes the message for both parties, and emits `MessageSent`.
5. **Real-Time Display:** Recipient connects their wallet and instantly sees incoming notifications in their on-chain Inbox.

---

### Slide 6: Technical Architecture
* **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide icons.
* **Web3 Integration:** Wagmi v2, Viem, TanStack React Query v5.
* **Smart Contract:** Solidity `0.8.20`, Hardhat development environment.
* **Validation Layer:**
  * Rejects address(0) preventing dead transmissions.
  * Rejects self-messaging to preserve cleanly indexed records.
  * Rejects empty payloads and bounds size to 280 bytes to guarantee low gas footprints.

---

### Slide 7: Safety & Transparency by Design
* **Radical Transparency:** Built as an open, public message board / bulletin system.
* **Economic Spam Resistance:** Unlike zero-cost Web2 platforms flooded by automated bot farms, each KeyDrop message requires a standard blockchain gas fee in `BOT` tokens, eliminating mass spam viability.
* **High Reliability:** 15 unit tests covering boundary scenarios, rejection logic, index pagination, and state integrity.

---

### Slide 8: Market Opportunity & Use Cases
* **Wallet-to-Wallet Direct Alerts:** Alert a counterparty of an OTC trade, DeFi liquidation, or token transfer.
* **NFT & Gaming Announcements:** Developers can drop public messages directly to top holders or player addresses.
* **Public Attestation & Micro-Blogging:** Immutable timestamped announcements that can never be retracted or manipulated.
* **DAO & Governance Notices:** Broadcast official public notices directly to delegate wallet inboxes.

---

### Slide 9: Development Roadmap
* **Milestone 1 (Completed):** Protocol design, contract deployment on BOT Chain Mainnet, full UI with Sent/Inbox feeds.
* **Milestone 2 (Next):** Asymmetric PGP/ECIES client-side encryption toggle for private peer-to-peer transmissions.
* **Milestone 3:** Web3 domain resolution (.bot, ENS) and Push Notification integration for active alerts.
* **Milestone 4:** Multi-chain expansion across EVM L1s and L2s.

---

### Slide 10: Summary & Traction
* **Live Mainnet Contract:** [`0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2`](https://scan.botchain.ai/address/0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2)
* **Chain:** BOT Chain Mainnet (Chain ID `677`, RPC: `https://rpc.botchain.ai`)
* **Official Website:** [https://botchain.ai](https://botchain.ai)
* **Explorer:** [https://scan.botchain.ai](https://scan.botchain.ai)
* **Ready for Integration:** Simple, clean, robust, and verifiable communication primitives for the emerging decentralized economy.
