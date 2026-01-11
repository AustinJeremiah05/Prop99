/**
 * AI Orchestrator
 * Coordinates satellite service and 3 AI agents
 * Calculates consensus and submits to blockchain
 */
import { spawn } from 'child_process';
import { logger } from './utils/logger';
import { calculateConsensus } from './consensus';
import { submitVerification } from './submitter';
import path from 'path';

interface VerificationRequest {
  requestId: string;
  requester: string;
  assetType: number;
  latitude: number;
  longitude: number;
  documentHashes: string[];
  blockNumber: bigint;
  transactionHash: string;
}

interface AgentResponse {
  valuation: number;
  confidence: number;
  reasoning: string;
  risk_factors: string[];
  agent: string;
  error?: string;
}

/**
 * Process a verification request through the AI pipeline
 */
export async function processVerificationRequest(request: VerificationRequest) {
  const startTime = Date.now();
  
  try {
    logger.info('🔄 Starting AI analysis pipeline...\n');
    
    // Step 1: Fetch satellite data
    logger.info('📡 Step 1: Fetching satellite imagery...');
    const satelliteData = await fetchSatelliteData(request.latitude, request.longitude);
    logger.info(`✅ Satellite data: ${satelliteData.area_sqm} sqm, NDVI ${satelliteData.ndvi}`);
    logger.info(`   Cloud coverage: ${satelliteData.cloud_coverage}%, Resolution: ${satelliteData.resolution_meters}m\n`);
    
    // Step 2: Prepare analysis package
    const analysisPackage = {
      request_id: request.requestId,
      latitude: request.latitude,
      longitude: request.longitude,
      location: `${request.latitude},${request.longitude}`,
      satellite_data: satelliteData,
      document_count: request.documentHashes.length,
      document_hashes: request.documentHashes
    };
    
    // Step 3: Run all 3 AI agents in parallel
    logger.info('🤖 Step 2: Running 3 AI agents in parallel...');
    const [agent1Result, agent2Result, agent3Result] = await Promise.all([
      runAgent('agent1.py', analysisPackage, 'Groq'),
      runAgent('agent2.py', analysisPackage, 'OpenRouter'),
      runAgent('agent3.py', analysisPackage, 'Gemini')
    ]);
    
    // Filter out errors
    const validResponses: AgentResponse[] = [];
    const responses = [agent1Result, agent2Result, agent3Result];
    
    for (let i = 0; i < responses.length; i++) {
      if (responses[i].error) {
        logger.error(`❌ Agent ${i + 1} failed: ${responses[i].error}`);
      } else {
        validResponses.push(responses[i]);
        logger.info(`✅ Agent ${i + 1} (${responses[i].agent}): $${responses[i].valuation.toLocaleString()} (${responses[i].confidence}% confidence)`);
      }
    }
    
    if (validResponses.length < 2) {
      throw new Error(`Insufficient AI responses: only ${validResponses.length} agents responded successfully`);
    }
    
    logger.info('');
    
    // Step 4: Calculate consensus
    logger.info('🔮 Step 3: Calculating consensus...');
    const consensus = calculateConsensus(validResponses);
    logger.info(`✅ Consensus reached: $${consensus.finalValuation.toLocaleString()}`);
    logger.info(`   Final confidence: ${consensus.finalConfidence}%`);
    logger.info(`   Consensus score: ${consensus.consensusScore}/100`);
    logger.info(`   Standard deviation: ±$${consensus.statistics.standardDeviation.toLocaleString()}\n`);
    
    // Step 5: Submit to blockchain
    logger.info('⛓️  Step 4: Submitting to blockchain...');
    const txHash = await submitVerification(
      request.requestId,
      consensus.finalValuation,
      consensus.finalConfidence,
      satelliteData,
      validResponses
    );
    logger.info(`✅ Transaction submitted: ${txHash}\n`);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info('═══════════════════════════════════════════════════════════════');
    logger.info(`✅ REQUEST COMPLETED IN ${duration}s`);
    logger.info('═══════════════════════════════════════════════════════════════\n');
    
  } catch (error) {
    logger.error('❌ Error processing request:', error);
    throw error;
  }
}

/**
 * Fetch satellite data using Python service
 */
async function fetchSatelliteData(latitude: number, longitude: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonPath = process.env.PYTHON_PATH || 'python';
    const scriptPath = path.join(__dirname, '..', 'satellite_service.py');
    
    const python = spawn(pythonPath, [scriptPath]);
    
    let dataString = '';
    let errorString = '';
    
    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Satellite service failed: ${errorString}`));
      } else {
        try {
          const result = JSON.parse(dataString);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse satellite data: ${dataString}`));
        }
      }
    });
    
    // Send input
    python.stdin.write(JSON.stringify({ latitude, longitude }));
    python.stdin.end();
    
    // Timeout after 60 seconds
    setTimeout(() => {
      python.kill();
      reject(new Error('Satellite service timeout'));
    }, 60000);
  });
}

/**
 * Run a single AI agent
 */
async function runAgent(scriptName: string, data: any, agentName: string): Promise<AgentResponse> {
  return new Promise((resolve) => {
    const pythonPath = process.env.PYTHON_PATH || 'python';
    const scriptPath = path.join(__dirname, '..', scriptName);
    
    const python = spawn(pythonPath, [scriptPath]);
    
    let dataString = '';
    let errorString = '';
    
    python.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    python.stderr.on('data', (data) => {
      errorString += data.toString();
    });
    
    python.on('close', (code) => {
      if (code !== 0) {
        resolve({
          valuation: 0,
          confidence: 0,
          reasoning: '',
          risk_factors: [],
          agent: agentName.toLowerCase(),
          error: errorString || 'Agent failed'
        });
      } else {
        try {
          const result = JSON.parse(dataString);
          resolve(result);
        } catch (e) {
          resolve({
            valuation: 0,
            confidence: 0,
            reasoning: '',
            risk_factors: [],
            agent: agentName.toLowerCase(),
            error: `Failed to parse response: ${dataString}`
          });
        }
      }
    });
    
    // Send input
    python.stdin.write(JSON.stringify(data));
    python.stdin.end();
    
    // Timeout after 30 seconds
    setTimeout(() => {
      python.kill();
      resolve({
        valuation: 0,
        confidence: 0,
        reasoning: '',
        risk_factors: [],
        agent: agentName.toLowerCase(),
        error: 'Agent timeout'
      });
    }, 30000);
  });
}
