/**
 * Blockchain Submitter
 * Submits verification results back to smart contract
 */
import { createWalletClient, http, parseEther, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mantle } from 'viem/chains';
import { logger } from './utils/logger';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const ORACLE_ROUTER_ADDRESS = process.env.ORACLE_ROUTER_ADDRESS as `0x${string}`;
const ORACLE_PRIVATE_KEY = (process.env.ORACLE_PRIVATE_KEY?.trim().startsWith('0x') 
  ? process.env.ORACLE_PRIVATE_KEY.trim() 
  : `0x${process.env.ORACLE_PRIVATE_KEY?.trim()}`) as `0x${string}`;
const IS_TESTNET = process.env.NODE_ENV !== 'production';
const RPC_URL = IS_TESTNET ? process.env.MANTLE_TESTNET_RPC_URL : process.env.MANTLE_RPC_URL;
const PINATA_JWT = process.env.PINATA_JWT;

// Evidence mapping file path
const EVIDENCE_MAP_PATH = path.join(__dirname, '..', 'evidence-map.json');

/**
 * Store evidence hash mapping for frontend access
 */
function storeEvidenceMapping(requestId: string, evidenceHash: string): void {
  try {
    let mapping: Record<string, string> = {};
    
    // Read existing mapping if it exists
    if (fs.existsSync(EVIDENCE_MAP_PATH)) {
      const data = fs.readFileSync(EVIDENCE_MAP_PATH, 'utf-8');
      mapping = JSON.parse(data);
    }
    
    // Add new mapping
    mapping[requestId] = evidenceHash;
    
    // Write back to file
    fs.writeFileSync(EVIDENCE_MAP_PATH, JSON.stringify(mapping, null, 2));
    logger.info(`📝 Evidence mapping stored: Request ${requestId} -> ${evidenceHash}`);
  } catch (error) {
    logger.error('Failed to store evidence mapping:', error);
  }
}

/**
 * Get friendly model name for agent
 */
function getAgentModelName(agentName: string): string {
  const modelMap: Record<string, string> = {
    'Groq': 'Llama 3.3 70B Versatile',
    'OpenRouter': 'GPT-4o-mini',
    'Gemini': 'Meta Llama 3.1 8B Instruct'
  };
  return modelMap[agentName] || agentName;
}

// Define Mantle Sepolia Testnet
const mantleSepolia = defineChain({
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
const account = privateKeyToAccount(ORACLE_PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: IS_TESTNET ? mantleSepolia : mantle,
  transport: http(RPC_URL)
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
] as const;

/**
 * Submit rejection to blockchain
 * Uses submitVerification with 0 valuation and 1% confidence to indicate rejection
 */
export async function submitRejection(
  requestId: string,
  reason: string
): Promise<string> {
  try {
    logger.info('🚫 Submitting rejection to blockchain...');
    logger.info(`   Reason: ${reason}`);
    logger.info(`   Method: submitVerification with $0 valuation and 1% confidence (rejection)`);
    
    // Submit as verification with 0 valuation and 1% confidence (indicates rejection)
    // Contract requires confidence > 0, so we use 1 (minimum) to indicate rejection
    const hash = await walletClient.writeContract({
      address: ORACLE_ROUTER_ADDRESS,
      abi: ORACLE_ROUTER_ABI,
      functionName: 'submitVerification',
      args: [
        BigInt(requestId),
        BigInt(0),  // 0 valuation = rejection
        BigInt(1)   // 1% confidence = rejection (minimum allowed by contract)
      ]
    });
    
    logger.info(`✅ Rejection transaction sent: ${hash}`);
    logger.info(`   The request will show as VERIFIED with $0 value and 1% confidence (rejected)`);
    return hash;
    
  } catch (error) {
    logger.error('❌ Failed to submit rejection:', error);
    throw error;
  }
}

/**
 * Submit verification result to blockchain
 */
export async function submitVerification(
  requestId: string,
  valuation: number,
  confidence: number,
  satelliteData: any,
  agentResponses: any[],
  nodeResponses?: any[]  // Individual agent scores with names
): Promise<string> {
  try {
    // Upload evidence to IPFS
    logger.info('📦 Uploading evidence to IPFS...');
    
    // Create detailed analysis breakdown with individual agent scores
    const analysisBreakdown = {
      requestId,
      finalValuation: valuation,
      finalConfidence: confidence,
      timestamp: new Date().toISOString(),
      satelliteData,
      agentAnalysis: {
        agents: nodeResponses || agentResponses.map(r => ({
          name: r.agent,
          model: getAgentModelName(r.agent),
          valuation: r.valuation,
          confidence: r.confidence,
          reasoning: r.reasoning,
          risk_factors: r.risk_factors || []
        })),
        consensusMethod: 'weighted_average',
        fullResponses: agentResponses
      }
    };
    
    const evidenceHash = await uploadEvidence(analysisBreakdown);
    logger.info(`✅ Evidence uploaded: ${evidenceHash}`);
    
    // Store mapping for frontend access
    storeEvidenceMapping(requestId, evidenceHash.replace('ipfs://', ''));
    
    // Submit to blockchain
    logger.info('📤 Submitting transaction to Mantle Sepolia...');
    
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
    
    logger.info(`⏳ Waiting for confirmation...`);
    
    // In production, you'd wait for the transaction receipt here
    // For now, just return the hash
    
    return hash;
    
  } catch (error) {
    logger.error('❌ Failed to submit verification:', error);
    throw error;
  }
}

/**
 * Upload evidence package to IPFS via Pinata
 */
async function uploadEvidence(evidence: any): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error('PINATA_JWT not configured. Cannot upload evidence to IPFS.');
  }
  
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        pinataContent: evidence,
        pinataMetadata: {
          name: `Evidence_${evidence.requestId.slice(2, 12)}.json`
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.IpfsHash;
    
  } catch (error) {
    logger.error('❌ IPFS upload failed:', error);
    throw new Error(`IPFS upload failed: ${error}`);
  }
}
