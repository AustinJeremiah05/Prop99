<img width="672" height="181" alt="Prop999" src="https://github.com/user-attachments/assets/dd12a5df-843b-40f9-a9b4-6325da6cfbc0" />

## AI-DRIVEN RWA VERIFICATION & TOKENIZATION ON MANTLE L2

Prop99 is a **rollup-native Real World Asset (RWA) and RealFi protocol** built on **Mantle L2**.
It enables **AI-based verification, on-chain consensus, Ethereum-anchored trust, and scalable tokenization** of real-world assets such as real estate, invoices, and cash-flow assets.

Prop99 bridges off-chain asset data with on-chain execution by combining **multi-agent AI verification**, **Mantle L2 smart contracts**, and **Ethereum rollup anchoring**, enabling RWAs to safely participate in DeFi with **L1-grade security at L2 cost**.

---

## PROBLEM

* Real-world assets cannot be verified natively by blockchains.
* Existing RWA systems rely on centralized or opaque oracle providers.
* Oracle failures and manipulation have caused major DeFi losses.
* Ethereum L1 verification costs are prohibitively expensive.
* Lack of provable, auditable verification blocks institutional DeFi adoption.

---

## SOLUTION

* AI-driven asset verification executed off-chain.
* On-chain oracle consensus and validation on Mantle L2.
* Cryptographic anchoring of verification commitments to Ethereum.
* Factory-based RWA tokenization with protocol-level compliance.
* Low-cost, scalable architecture using Mantle's modular rollup design.

---

## SMART CONTRACTS DEPLOYED (MANTLE L2)

### CORE APPLICATION CONTRACTS
```text
ORACLE_ROUTER_ADDRESS
0xf4d1656069B739d652CdFC8Cc6ddE2Cd0b2d9A9C

CONSENSUS_ENGINE_ADDRESS
0xd964828145Eb879fD0204A85774391b3dD192e1A

VERIFICATION_ANCHOR_ADDRESS
0xeBE3F5A0411a78B61626c90258a3d46380a11a20

ASSET_REGISTRY_ADDRESS
0x94768a15Cd37e07eEcc02eDe47D134A26C1ecB3f

RWA_TOKEN_FACTORY_ADDRESS
0x68283AAa8899A4aA299141ca6f04dF8e5802509f

COMPLIANCE_MODULE_ADDRESS
0x0bfB6f131A99D5aaA3071618FFBD5bb3ea87C619
```

### MANTLE ROLLUP SYSTEM CONTRACTS
```text
L2CrossDomainMessenger
0x4200000000000000000000000000000000000007

L2_TO_L1_MESSAGE_PASSER
0x4200000000000000000000000000000000000016

L1Block
0x4200000000000000000000000000000000000015
```

These contracts are used to **anchor verification commitments to Ethereum**, inheriting L1 security.

---

<img width="1142" height="643" alt="Prop99" src="https://github.com/user-attachments/assets/f1d0a34e-080b-40f5-bbb7-f3280956721f" />


## HOW IT WORKS (END-TO-END FLOW)

1. A user submits asset metadata and document hashes via the **OracleRouter** on Mantle L2.
2. Off-chain AI oracle nodes detect the request and independently analyze:
   * Asset documents (OCR & parsing)
   * Satellite imagery and historical data
   * Market and pricing data
3. Each oracle submits signed valuation and confidence scores back on-chain.
4. The **ConsensusEngine** validates quorum, confidence thresholds, and computes a weighted valuation.
5. The verification commitment is anchored to Ethereum via Mantle's **L2-to-L1 rollup messaging system**.
6. The **RWATokenFactory** deploys an asset-specific token contract.
7. The asset is registered in the **AssetRegistry** and exposed via an on-chain valuation oracle.

---

## PROJECT STRUCTURE
```text
prop99/
│
├── frontend/                          # Next.js frontend application
│   ├── .next/                         # Next.js build output
│   ├── abis/                          # Contract ABIs for frontend
│   ├── app/                           # Next.js 13+ app directory
│   ├── components/                    # React components
│   ├── config/                        # Frontend configuration
│   ├── context/                       # React context providers
│   ├── lib/                           # Utility libraries
│   ├── node_modules/                  # Dependencies
│   ├── public/                        # Static assets
│   ├── styles/                        # CSS/styling files
│   ├── .env                           # Environment variables (create from .env.example)
│   ├── .env.example                   # Environment template
│   ├── .env.local                     # Local environment overrides
│   ├── .gitignore                     # Git ignore rules
│   ├── components.json                # Component configuration
│   ├── next.config.js                 # Next.js configuration
│   ├── next-env.d.ts                  # Next.js TypeScript declarations
│   ├── package.json                   # Frontend dependencies
│   ├── package-lock.json              # Lock file
│   ├── pnpm-lock.yaml                 # PNPM lock file
│   ├── postcss.config.js              # PostCSS configuration
│   ├── README.md                      # Frontend documentation
│   ├── requirements_satellite.txt     # Python satellite processing requirements
│   ├── satellite_ndvi.png             # NDVI visualization
│   ├── satellite_rgb.png              # RGB satellite imagery
│   ├── satellite_sentinel2_enhanced.png # Enhanced Sentinel-2 imagery
│   ├── satellite_tester.py            # Satellite testing script
│   └── tailwind.config.js             # Tailwind CSS configuration
│
├── offchain/                          # AI oracle & backend services
│   ├── dist/                          # Compiled distribution
│   ├── node_modules/                  # Dependencies
│   ├── src/                           # Source code
│   │   ├── agent1.py                  # AI Agent 1 - Document Analysis
│   │   ├── agent2.py                  # AI Agent 2 - Satellite Analysis
│   │   ├── agent3.py                  # AI Agent 3 - Market Analysis
│   │   ├── authorize-consensus-engine.js
│   │   ├── authorize-new-contracts.js
│   │   ├── authorize-oracle.js
│   │   ├── authorize-tokenization.js
│   │   ├── check-consensus-auth.js
│   │   ├── check-oracle-auth.js
│   │   ├── evidence-map.json          # Evidence mapping
│   │   ├── extract-pdf.js             # PDF extraction utility
│   │   ├── oracle.txt                 # Oracle documentation
│   │   └── satellite_service.py       # Satellite data service
│   ├── .env                           # Environment variables (create from .env.example)
│   ├── .env.example                   # Environment template
│   ├── .gitignore                     # Git ignore rules
│   ├── package.json                   # Backend dependencies
│   ├── package-lock.json              # Lock file
│   ├── README.md                      # Backend documentation
│   ├── requirements.txt               # Python requirements
│   └── sale-deed-extracted.json       # Sample extracted data
│
├── contracts/                         # Solidity smart contracts
│   ├── artifacts/                     # Hardhat compilation artifacts
│   ├── cache/                         # Hardhat cache
│   ├── contracts/                     # Contract source files
│   │   ├── AssetRegistry.sol          # Asset registry contract
│   │   ├── ComplianceModule.sol       # Compliance verification
│   │   ├── ConsensusEngine.sol        # Oracle consensus mechanism
│   │   ├── OracleRouter.sol           # Oracle request router
│   │   ├── RWAToken.sol               # RWA token implementation
│   │   ├── RWATokenFactory.sol        # Token factory contract
│   │   └── VerificationAnchor.sol     # Ethereum anchoring
│   ├── node_modules/                  # Dependencies
│   ├── scripts/                       # Deployment scripts
│   ├── .env                           # Environment variables (create from .env.example)
│   ├── .env.example                   # Environment template
│   ├── .gitignore                     # Git ignore rules
│   ├── deployment-addresses.json      # Deployed contract addresses
│   ├── hardhat.config.js              # Hardhat configuration
│   ├── package.json                   # Contract dependencies
│   ├── package-lock.json              # Lock file
│   └── README.md                      # Contract documentation
│
└── README.md                          # Main project documentation
```

---

## ENVIRONMENT SETUP

### FRONTEND CONFIGURATION (`frontend/.env.example`)

Create a `frontend/.env` file with the following variables:
```env
# Google Earth Engine Configuration
# Get your project ID from: https://console.cloud.google.com/
# 1. Create a new project or select existing
# 2. Enable Earth Engine API
# 3. Copy your project ID
GOOGLE_EARTH_ENGINE_PROJECT_ID=your-gee-project-id

# WalletConnect Project ID
# Get from: https://cloud.walletconnect.com/
# 1. Sign up/login
# 2. Create new project
# 3. Copy Project ID
NEXT_PUBLIC_PROJECT_ID=your-walletconnect-project-id

# Pinata (IPFS) Configuration
# Get from: https://app.pinata.cloud/
# 1. Sign up/login
# 2. Go to API Keys
# 3. Create new key with admin access
# 4. Copy JWT token
PINATA_JWT=your-pinata-jwt-token

# Deployed Contract Addresses (Mantle L2)
NEXT_PUBLIC_ORACLE_ROUTER_ADDRESS=0xf4d1656069B739d652CdFC8Cc6ddE2Cd0b2d9A9C
```

---

### OFF-CHAIN ORACLE CONFIGURATION (`offchain/.env.example`)

Create an `offchain/.env` file with the following variables:
```env
# Node Environment
NODE_ENV=development

# Mantle RPC Endpoints
MANTLE_RPC_URL=https://rpc.mantle.xyz
MANTLE_TESTNET_RPC_URL=https://rpc.sepolia.mantle.xyz

# Wallet Private Keys (NEVER COMMIT THESE!)
# Your oracle node wallet private key
ORACLE_PRIVATE_KEY=your-oracle-wallet-private-key
# Contract owner wallet private key
OWNER_PRIVATE_KEY=your-owner-wallet-private-key

# Deployed Contract Addresses (Mantle L2)
ORACLE_ROUTER_ADDRESS=0xf4d1656069B739d652CdFC8Cc6ddE2Cd0b2d9A9C
CONSENSUS_ENGINE_ADDRESS=0xd964828145Eb879fD0204A85774391b3dD192e1A
VERIFICATION_ANCHOR_ADDRESS=0xeBE3F5A0411a78B61626c90258a3d46380a11a20
ASSET_REGISTRY_ADDRESS=0x94768a15Cd37e07eEcc02eDe47D134A26C1ecB3f
RWA_TOKEN_FACTORY_ADDRESS=0x68283AAa8899A4aA299141ca6f04dF8e5802509f
COMPLIANCE_MODULE_ADDRESS=0x0bfB6f131A99D5aaA3071618FFBD5bb3ea87C619

# Google Earth Engine Configuration
# Same as frontend setup
GOOGLE_EARTH_ENGINE_PROJECT_ID=your-gee-project-id

# AI Model API Keys
# Groq API - Get from: https://console.groq.com/
# 1. Sign up/login
# 2. Go to API Keys
# 3. Create new key
GROQ_API_KEY=your-groq-api-key

# OpenRouter API - Get from: https://openrouter.ai/
# 1. Sign up/login
# 2. Go to Keys
# 3. Create new key
OPENROUTER_API_KEY=your-openrouter-api-key

# WalletConnect Project ID
NEXT_PUBLIC_PROJECT_ID=your-walletconnect-project-id

# Google Custom Search Configuration
# Get from: https://console.cloud.google.com/
# 1. Enable Custom Search API
# 2. Create credentials (API key)
# Get CSE ID from: https://programmablesearchengine.google.com/
# 1. Create new search engine
# 2. Copy Search engine ID
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CSE_ID=your-custom-search-engine-id

# Pinata (IPFS) Configuration
PINATA_JWT=your-pinata-jwt-token

# OCR Space API
# Get from: https://ocr.space/ocrapi
# 1. Sign up for free account
# 2. Copy API key from dashboard
OCR_SPACE_API_KEY=your-ocr-space-api-key

# Oracle Configuration
ORACLE_NODE_ID=1
CONSENSUS_THRESHOLD=2
CONFIDENCE_THRESHOLD=80

# Python Configuration
PYTHON_PATH=python
LOG_LEVEL=info
```

---

## HOW TO RUN LOCALLY

### PREREQUISITES

* Node.js v18+ and npm/pnpm
* Python 3.8+
* Git

---

### 1. CLONE THE REPOSITORY
```bash
git clone https://github.com/your-username/prop99.git
cd prop99
```

---

### 2. SETUP & RUN FRONTEND
```bash
cd frontend
npm install
# or
pnpm install

# Create your .env file from .env.example and fill in your API keys
cp .env.example .env

# Start development server
npm run dev
# or
pnpm dev
```

Frontend will be available at: **http://localhost:3000**

---

### 3. SETUP & RUN OFF-CHAIN ORACLE SERVICE
```bash
cd offchain

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# Create your .env file from .env.example and fill in your configuration
cp .env.example .env

# Start oracle service
node src/authorize-oracle.js
```

This service:
* Listens to Mantle L2 blockchain events
* Runs multi-agent AI verification
* Submits oracle responses on-chain
* Coordinates consensus mechanism

---

### 4. SMART CONTRACT DEPLOYMENT (OPTIONAL)
```bash
cd contracts
npm install

# Create your .env file
cp .env.example .env

# Compile contracts
npx hardhat compile

# Deploy to Mantle testnet
npx hardhat run scripts/deploy.js --network mantleTestnet
```

---

## KEY FEATURES

* ✅ Rollup-native execution on **Mantle L2**
* ✅ Multi-agent AI oracle verification system
* ✅ On-chain oracle consensus & confidence thresholds
* ✅ Ethereum-anchored verification via rollup messaging
* ✅ Factory-based RWA tokenization
* ✅ On-chain asset registry and valuation oracle
* ✅ DeFi-ready RealFi integration
* ✅ Satellite imagery analysis (Sentinel-2, NDVI)
* ✅ Document OCR and verification
* ✅ Market data integration

---

## TECH STACK

**Blockchain:**
* Mantle L2 (OP Stack)
* Solidity ^0.8.0
* Hardhat
* ethers.js

**Frontend:**
* Next.js 13+
* React
* TailwindCSS
* WalletConnect

**Backend/Oracle:**
* Node.js
* Python 3.8+
* Express.js

**AI & Data:**
* Groq API
* OpenRouter API
* Google Earth Engine
* OCR.space API
* Google Custom Search

**Storage:**
* IPFS (Pinata)

---

## TEAM

* **Austin Jeremiah J** - Full Stack & Blockchain Developer
* **Suganthan T S** - Smart Contract Engineer
* **Sylesh** - AI/ML Engineer

---

## LICENSE

MIT License

---

## LINKS

* **Vercel:** https://prop99.vercel.app/
* **Pitch Link:** (https://youtu.be/gwcSH2R9sw0?si=zmorJsxG9ty0pR5N)

---

## SUPPORT

For questions or issues, please open an issue on GitHub or contact the team.
