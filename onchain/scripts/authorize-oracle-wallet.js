/**
 * Authorize Oracle Wallet Script
 * This authorizes the oracle wallet to submit verifications and rejections
 */
const hre = require("hardhat");

async function main() {
  console.log("🔐 Authorizing Oracle Wallet...\n");

  // Contract address
  const ORACLE_ROUTER_ADDRESS = "0xf4d1656069B739d652CdFC8Cc6ddE2Cd0b2d9A9C";
  
  // Oracle wallet address (the one submitting verifications)
  const ORACLE_WALLET_ADDRESS = "0x588F6b3169F60176c1143f8BaB47bCf3DeEbECdc";

  // Get the contract
  const OracleRouter = await hre.ethers.getContractAt("OracleRouter", ORACLE_ROUTER_ADDRESS);

  console.log(`📍 Oracle Router: ${ORACLE_ROUTER_ADDRESS}`);
  console.log(`👤 Oracle Wallet: ${ORACLE_WALLET_ADDRESS}\n`);

  // Check current authorization status
  const isAuthorizedBefore = await OracleRouter.authorizedOracles(ORACLE_WALLET_ADDRESS);
  console.log(`Current authorization status: ${isAuthorizedBefore}\n`);

  if (isAuthorizedBefore) {
    console.log("✅ Oracle wallet is already authorized!");
    return;
  }

  // Authorize the oracle
  console.log("⏳ Authorizing oracle wallet...");
  const tx = await OracleRouter.authorizeOracle(ORACLE_WALLET_ADDRESS);
  console.log(`📤 Transaction sent: ${tx.hash}`);
  
  await tx.wait();
  console.log("✅ Transaction confirmed!\n");

  // Verify authorization
  const isAuthorizedAfter = await OracleRouter.authorizedOracles(ORACLE_WALLET_ADDRESS);
  console.log(`New authorization status: ${isAuthorizedAfter}`);

  if (isAuthorizedAfter) {
    console.log("\n🎉 Oracle wallet successfully authorized!");
    console.log("The oracle can now submit verifications and rejections.");
  } else {
    console.log("\n❌ Authorization failed!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
