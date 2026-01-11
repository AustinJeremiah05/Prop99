"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitVerification = submitVerification;
/**
 * Blockchain Submitter
 * Submits verification results back to smart contract
 */
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const chains_1 = require("viem/chains");
const logger_1 = require("./utils/logger");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ORACLE_ROUTER_ADDRESS = process.env.ORACLE_ROUTER_ADDRESS;
const ORACLE_PRIVATE_KEY = (process.env.ORACLE_PRIVATE_KEY?.trim().startsWith('0x')
    ? process.env.ORACLE_PRIVATE_KEY.trim()
    : `0x${process.env.ORACLE_PRIVATE_KEY?.trim()}`);
const IS_TESTNET = process.env.NODE_ENV !== 'production';
const RPC_URL = IS_TESTNET ? process.env.MANTLE_TESTNET_RPC_URL : process.env.MANTLE_RPC_URL;
const PINATA_JWT = process.env.PINATA_JWT;
// Define Mantle Sepolia Testnet
const mantleSepolia = (0, viem_1.defineChain)({
    id: 5003,
    name: 'Mantle Sepolia Testnet',
    network: 'mantle-sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'MNT',
        symbol: 'MNT',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.sepolia.mantle.xyz'],
        },
        public: {
            http: ['https://rpc.sepolia.mantle.xyz'],
        },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
    },
    testnet: true,
});
// Create wallet client
const account = (0, accounts_1.privateKeyToAccount)(ORACLE_PRIVATE_KEY);
const walletClient = (0, viem_1.createWalletClient)({
    account,
    chain: IS_TESTNET ? mantleSepolia : chains_1.mantle,
    transport: (0, viem_1.http)(RPC_URL)
});
// Contract ABI - OracleRouter.sol
const ORACLE_ROUTER_ABI = [
    {
        inputs: [
            { name: '_requestId', type: 'uint256' },
            { name: '_valuation', type: 'uint256' },
            { name: '_confidence', type: 'uint256' }
        ],
        name: 'submitVerification',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];
/**
 * Submit verification result to blockchain
 */
async function submitVerification(requestId, valuation, confidence, satelliteData, agentResponses) {
    try {
        // Upload evidence to IPFS
        logger_1.logger.info('📦 Uploading evidence to IPFS...');
        const evidenceHash = await uploadEvidence({
            requestId,
            valuation,
            confidence,
            satelliteData,
            agentResponses,
            timestamp: new Date().toISOString()
        });
        logger_1.logger.info(`✅ Evidence uploaded: ${evidenceHash}`);
        // Submit to blockchain
        logger_1.logger.info('📤 Submitting transaction to Mantle Sepolia...');
        const hash = await walletClient.writeContract({
            address: ORACLE_ROUTER_ADDRESS,
            abi: ORACLE_ROUTER_ABI,
            functionName: 'submitVerification',
            args: [
                BigInt(requestId),
                BigInt(valuation),
                BigInt(confidence)
            ]
            // Let viem estimate gas automatically
        });
        logger_1.logger.info(`⏳ Waiting for confirmation...`);
        // In production, you'd wait for the transaction receipt here
        // For now, just return the hash
        return hash;
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to submit verification:', error);
        throw error;
    }
}
/**
 * Upload evidence package to IPFS via Pinata
 */
async function uploadEvidence(evidence) {
    if (!PINATA_JWT) {
        throw new Error('PINATA_JWT not configured. Cannot upload evidence to IPFS.');
    }
    try {
        const response = await axios_1.default.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            pinataContent: evidence,
            pinataMetadata: {
                name: `Evidence_${evidence.requestId.slice(2, 12)}.json`
            }
        }, {
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.IpfsHash;
    }
    catch (error) {
        logger_1.logger.error('❌ IPFS upload failed:', error);
        throw new Error(`IPFS upload failed: ${error}`);
    }
}
