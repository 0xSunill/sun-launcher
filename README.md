# ☀️ Sun Launcher

**Sun Launcher** is a full-stack Web3 application built on **Solana** that enables users to create, mint, and deploy SPL tokens with on-chain metadata — all without writing a single line of code. It also integrates with **Raydium CPMM** to allow users to create liquidity pools for their tokens directly from the UI.

Built with **Next.js 15 (App Router)**, **Token-2022 Programme**, and the **Raydium SDK v2**, Sun Launcher was developed as an MCA internship project at DYOR Research.

---

## 🚀 Live Demo

> Deployed on Vercel — [sun-launcher.vercel.app](https://sun-launcher.vercel.app) *(devnet)*

---

## ✨ Features

- 🪙 **Token Creation** — Create SPL tokens using the Token-2022 Programme with inline on-chain metadata (name, symbol, description, image)
- 🖼️ **IPFS Metadata Upload** — Token images and metadata are pinned to IPFS via Pinata and conform to the Metaplex standard
- 🔨 **Token Minting** — Mint additional supply to any wallet; ATA is created automatically if it does not exist
- 💧 **Liquidity Pool Creation** — Create Raydium CPMM (Constant Product Market Maker) pools pairing your token with SOL
- 👻 **Phantom Wallet Integration** — Auto-detects browser wallets via `@solana/wallet-adapter-react`
- 📱 **Responsive UI** — Fully responsive across mobile, tablet, and desktop with a frosted-glass dark theme
- 🔗 **Explorer Links** — Every transaction links directly to SolanaFM and Solana Explorer

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Blockchain | Solana Devnet |
| Token Standard | SPL Token-2022 with MetadataPointer Extension |
| Wallet | `@solana/wallet-adapter-react` v0.15 (auto-detect) |
| RPC Provider | Helius Devnet RPC |
| IPFS / Metadata | Pinata (`pinFileToIPFS`, `pinJSONToIPFS`) |
| Liquidity | Raydium SDK v2 (CPMM) |
| Styling | Tailwind CSS |
| Notifications | `react-hot-toast` |
| Decimals | `decimal.js` |

---

## 📁 Project Structure

```
sun-launcher/
├── app/
│   ├── layout.jsx                  # Root layout with AppWalletProvider
│   ├── page.jsx                    # Landing page
│   ├── createtoken/
│   │   └── page.js                 # Token creation handler (4-instruction transaction)
│   ├── minttoken/
│   │   └── page.js                 # Token minting page
│   └── liquidity/
│       └── page.js                 # Raydium CPMM pool creation
├── components/
│   ├── AppWalletProvider.jsx       # Wallet adapter context (auto-detect)
│   ├── Navbar.jsx                  # Navigation with wallet connect button
│   ├── MintTokenPage.jsx           # Minting UI and ATA logic
│   └── LiquidityPage.jsx           # Pool creation UI and Raydium integration
├── utils/
│   └── pinataUpload.js             # Two-stage IPFS upload utility
├── public/                         # Static assets
└── .env.local.example              # Environment variable template
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `v18` or higher
- A browser with **Phantom Wallet** installed and set to **devnet**
- A free [Helius](https://helius.dev) account (devnet API key)
- A free [Pinata](https://pinata.cloud) account (API key + secret)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/sun-launcher.git
cd sun-launcher
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_HELIUS_API_KEY_DEVNET=your_helius_devnet_api_key
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key
NEXT_PUBLIC_PINATA_SECRET_API_KEY=your_pinata_secret_key
```

> ⚠️ Never commit `.env.local` to version control. It is already listed in `.gitignore`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Get Devnet SOL

You'll need devnet SOL to pay for transactions. Get some from the faucet:

```bash
solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet
```

Or use the [Solana Web Faucet](https://faucet.solana.com).

---

## 🪙 How to Create a Token

1. Connect your Phantom wallet (make sure it's on **devnet**)
2. Navigate to **Create Token**
3. Fill in token name, symbol, description, and upload an image
4. Click **Create Token** — this sends a 4-instruction atomic transaction:
   - `SystemProgram.createAccount` — allocates mint account space
   - `createInitializeMetadataPointerInstruction` — sets inline metadata pointer
   - `createInitializeMintInstruction` — initialises the mint
   - `createInitializeInstruction` — writes metadata to the mint account
5. Approve the transaction in Phantom
6. Copy your new **Mint Address** from the success screen

---

## 🔨 How to Mint Tokens

1. Navigate to **Mint Token**
2. Paste your Mint Address
3. Enter the amount to mint
4. Click **Mint** — the app:
   - Checks if your ATA exists; creates it if not
   - Fetches the mint's `decimals` and scales the amount
   - Sends a `mintTo` instruction signed by your wallet
5. Approve in Phantom — minted tokens appear in your wallet

---

## 💧 How to Create a Liquidity Pool

1. Navigate to **Create Pool**
2. Enter your token's Mint Address
3. Set the initial SOL amount and token amount
4. Preview the starting price (calculated automatically)
5. Click **Create Pool** — this uses Raydium SDK v2 to:
   - Build the CPMM pool creation transaction
   - Wait for finalized blockhash commitment (~13 seconds on devnet)
   - Submit the transaction to the Solana network
6. The pool ID and Raydium Explorer link are shown on success

> ⏱️ Pool creation takes 15–30 seconds on devnet due to the `finalized` blockhash commitment, which prevents double-submission.

---

## 🔐 Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_HELIUS_API_KEY_DEVNET` | Helius RPC API key for Solana devnet |
| `NEXT_PUBLIC_PINATA_API_KEY` | Pinata API key for IPFS file uploads |
| `NEXT_PUBLIC_PINATA_SECRET_API_KEY` | Pinata secret key for IPFS file uploads |

---

## 📝 Metadata Standard

All tokens created by Sun Launcher conform to the **Metaplex token metadata standard**, ensuring compatibility with:

- 👻 Phantom Wallet
- 🌊 Solflare
- 🔍 Solana Explorer
- 📊 SolanaFM

```json
{
  "name": "MyToken",
  "symbol": "MTK",
  "description": "My custom Solana token",
  "image": "https://gateway.pinata.cloud/ipfs/<IMAGE_CID>",
  "attributes": []
}
```

---

## ⚠️ Known Limitations

- **Devnet only** — mainnet deployment requires replacing the Helius devnet endpoint and auditing all transaction parameters
- **Pool creation latency** — Raydium CPMM uses `finalized` blockhash commitment, which adds ~13 seconds to pool creation
- **Single wallet support** — only the wallet that created the mint can mint additional tokens (mint authority is not transferable in the current UI)
- **No token burn UI** — token burning is not implemented in this version

---

## 🗺️ Future Enhancements

- [ ] Mainnet support with network switcher
- [ ] Token burn functionality
- [ ] Mint authority transfer / revocation UI
- [ ] Portfolio view — list all tokens created by the connected wallet
- [ ] Support for additional Token-2022 extensions (Transfer Fees, Non-Transferable)
- [ ] Ledger hardware wallet support

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Solana Labs](https://solana.com) — for the SPL Token-2022 Programme
- [Raydium](https://raydium.io) — for the CPMM SDK v2
- [Helius](https://helius.dev) — for reliable Solana RPC infrastructure
- [Pinata](https://pinata.cloud) — for IPFS pinning services
- [DYOR Research](https://dyor.io) — internship host and project guide

---

<p align="center">Built with ❤️ on Solana</p>
