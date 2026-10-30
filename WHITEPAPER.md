# KeyDrop Whitepaper

**A Serverless, Decentralized Public Messaging Protocol on Botchain**

*Version 1.0 — October 2026*  
*Project Repository: [liljhnxn/keydrop](https://github.com/liljhnxn/keydrop)*  
*Smart Contract Address: [`0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2`](https://scan.botchain.ai/address/0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2)*  
*Network: BOT Chain Mainnet (Chain ID: `677`)*  

---

## 1. Executive Summary

Modern digital communication infrastructure is almost universally centralized. Traditional messaging applications rely on closed corporate databases, siloed identities, and centralized authentication servers that are susceptible to censorship, platform de-platforming, silent data alteration, and single points of failure. Even when end-to-end encrypted, metadata (sender, recipient, frequency) remains subject to proprietary server tracking and surveillance.

**KeyDrop** presents an alternative paradigm: a lightweight, serverless, and decentralized on-chain messaging protocol deployed natively on **Botchain**. KeyDrop utilizes EVM-compatible smart contracts as an immutable public communication registry. Users authenticate directly via cryptographic keypairs (Web3 wallets), transmit timestamped communications across wallet boundaries, and inspect transparent communication histories with zero reliance on backend APIs, cloud databases, or third-party intermediaries.

By enforcing strict payload bounds (up to 280 UTF-8 bytes) and bytecode-level validation constraints at the contract level, KeyDrop guarantees high throughput, gas predictability, and an unalterable public audit trail for notifications, attestations, and peer-to-peer notices.

---

## 2. Problem Statement

### 2.1 Centralization & Platform Risk in Web2 Messaging
Conventional instant messaging tools (WhatsApp, Telegram, Slack, Discord) introduce several core structural vulnerabilities:
1. **Arbitrary Censorship & Account Deletion:** Identity is tied to phone numbers or emails owned and policed by centralized telecom or tech conglomerates. Accounts can be terminated or shadow-banned without appeal.
2. **Data Ephemerality & Silent Modification:** Messages stored on cloud database instances (PostgreSQL, MongoDB) can be silently purged, modified, or reordered by database administrators or compromised services.
3. **Identity Rent-Seeking:** Users do not own their identity; they rent an identifier under the platform's terms of service.
4. **Walled Gardens:** Interoperability across platforms is virtually non-existent without fragile API bridges that platforms regularly monetize or shut down.

### 2.2 Inefficiency & Complexity in Early Web3 Messaging
Existing on-chain messaging attempts often suffer from:
- Excessive gas costs due to unconstrained string storage.
- Complex off-chain decentralized storage dependencies (IPFS/Arweave pinners) that introduce availability latency and break autonomous smart contract composability.
- Lack of clean, standardized query interfaces for simple wallet-to-wallet indexing.

---

## 3. The KeyDrop Architecture

KeyDrop re-architects messaging around sovereign Web3 keypairs and on-chain immutability.

```
       +-------------------------------------------------------+
       |                  KeyDrop Client UI                    |
       |    (Next.js 15, React 19, Tailwind CSS, TypeScript)   |
       +-------------------------------------------------------+
                     |                          |
                     | Wallet Sign / Send       | Reactive Data Fetch
                     v                          v
       +-------------------------------------------------------+
       |                   wagmi v2 / viem                     |
       +-------------------------------------------------------+
                                |
               JSON-RPC (https://rpc.botchain.ai)
                                |
                                v
       +-------------------------------------------------------+
       |                  BOT Chain (EVM)                      |
       |                   Chain ID: 677                       |
       |                                                       |
       |   +-----------------------------------------------+   |
       |   |             KeyDrop Smart Contract            |   |
       |   |   0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2  |   |
       |   |                                               |   |
       |   |  - State: _messages, _sentIds, _receivedIds   |   |
       |   |  - Functions: sendMessage(), getSentMessages()|   |
       |   |  - Events: MessageSent                        |   |
       |   +-----------------------------------------------+   |
       +-------------------------------------------------------+
```

### 3.1 Sovereign Wallet Identity
In KeyDrop, your cryptographic wallet address is your public inbox and signature. No phone numbers, passwords, emails, or KYC forms are required. Any EVM-compatible address can receive messages immediately without prior account initialization.

### 3.2 Pure On-Chain Storage
Rather than relying on hybrid architectures or external hash pointers, message content is stored directly within the state storage of the smart contract. This provides:
- Instant finality alongside block confirmation.
- Direct read access for other smart contracts or decentralized indexers.
- True immutability—once confirmed in a Botchain block, a message can never be updated, deleted, or backdated.

---

## 4. Smart Contract Specifications

The KeyDrop protocol is implemented in Solidity (`^0.8.20`) with strict gas optimization and input verification routines.

### 4.1 Data Structures

```solidity
struct Message {
    uint256 id;
    address sender;
    address recipient;
    string content;
    uint256 timestamp;
}
```

* **`id`:** Incremental 1-based unique identifier generated sequentially via `_totalMessages`.
* **`sender`:** Cryptographic origin address derived securely from `msg.sender`.
* **`recipient`:** Target EVM wallet address.
* **`content`:** UTF-8 text string constrained to a maximum of 280 bytes.
* **`timestamp`:** Unix timestamp from `block.timestamp`.

### 4.2 State Storage & Dual Indexing
To enable high-performance querying without requiring centralized subgraphs or off-chain indexers, the contract maintains dual relational indexes:

```solidity
uint256 private _totalMessages;
mapping(uint256 => Message) private _messages;
mapping(address => uint256[]) private _sentMessageIds;
mapping(address => uint256[]) private _receivedMessageIds;
```

* **`_sentMessageIds`:** Maps each sender to their complete array of dispatched message IDs.
* **`_receivedMessageIds`:** Maps each recipient to their array of incoming message IDs.

### 4.3 Validation Guardrails
The `sendMessage` function enforces four strict validation assertions:

1. **Zero-Address Guard:** `require(recipient != address(0))` prevents permanent token burn or lost transmissions to unassigned genesis addresses.
2. **Anti-Self Messaging:** `require(recipient != msg.sender)` rejects self-addressed loops, keeping sender and receiver index arrays clean.
3. **Non-Empty String Check:** `require(bytes(content).length > 0)` rejects empty transactions.
4. **Strict Payload Cap:** `require(bytes(content).length <= 280)` caps transaction gas consumption, prevents denial-of-service block bloating, and maintains consistent micro-blogging length constraints.

### 4.4 Interface & View Functions
* `sendMessage(address recipient, string calldata content) external returns (uint256 messageId)`
* `getTotalMessages() external view returns (uint256)`
* `getMessage(uint256 id) external view returns (Message memory)`
* `getSentMessageCount(address user) external view returns (uint256)`
* `getReceivedMessageCount(address user) external view returns (uint256)`
* `getSentMessages(address user) external view returns (Message[] memory)`
* `getReceivedMessages(address user) external view returns (Message[] memory)`

---

## 5. Security, Privacy & Transparency Model

### 5.1 Public Transparency
KeyDrop is explicitly designed as a **public message board / bulletin system**. All stored messages are transparent blockchain state. Anyone running an RPC query or inspecting the BOT Chain block explorer can view message contents.

> **Important Disclosure:** KeyDrop does not provide confidential end-to-end encryption in version 1.0. Users are expressly warned within the UI and contract documentation never to transmit private keys, seed phrases, passwords, or personally identifiable information (PII).

### 5.2 Sybil & Spam Mitigation
Because every message write is an EVM transaction requiring gas paid in `BOT` tokens, spam flooding is economically disincentivized. Unlike Web2 platforms where bot farms can generate millions of free spam messages per minute, sending 1,000 spam messages on KeyDrop incurs linear gas costs.

### 5.3 Unit Testing & Verification
The protocol has been validated against 15 automated test suites using Hardhat, Chai, and ethers.js, validating:
- Boundary conditions (0 bytes, 1 byte, 280 bytes, 281 bytes rejection).
- Correct event emissions (`MessageSent`).
- Proper pagination and retrieval via `getSentMessages` and `getReceivedMessages`.
- Prevention of self-messaging and zero-address targets.

---

## 6. Network Deployment & Environment

KeyDrop is deployed and functional on **BOT Chain Mainnet**:

| Parameter | Configuration |
|:---|:---|
| **Network Name** | BOT Chain |
| **Chain ID** | `677` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Official Website** | [https://botchain.ai](https://botchain.ai) |
| **Currency Symbol** | `BOT` |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) |
| **Contract Address** | `0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2` |

---

## 7. Roadmap

### Phase 1: Core Protocol & Mainnet Deployment (Completed)
- [x] Solidity smart contract architecture and gas-optimized storage mapping.
- [x] Hardhat testing suite (15/15 tests passing).
- [x] Live deployment to BOT Chain Mainnet (`0x5BE39...`).
- [x] Responsive Next.js 15 Web3 application with sent/inbox tabs and real-time polling.

### Phase 2: Client-Side Asymmetric Encryption (Q1 2027)
- [ ] Diffie-Hellman / ECIES key exchange using standard wallet signatures.
- [ ] Optional client-side encryption toggle: senders encrypt payloads using recipient public keys before submitting on-chain.
- [ ] Decrypt on arrival directly inside the client application using personal wallet signatures.

### Phase 3: Push Notifications & IPFS Attachments (Q2 2027)
- [ ] Web3 push notification service (W3PS / Push Protocol) for instant inbox alerts.
- [ ] Cryptographic file attestation and encrypted media attachments via decentralized storage.
- [ ] ENS / Web3 domain name resolution for recipient addresses.
