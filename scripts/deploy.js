const { ethers, network } = require("hardhat");

async function main() {
  console.log("----------------------------------------------------");
  console.log(`Starting deployment of KeyDrop to network: ${network.name}`);
  console.log("----------------------------------------------------");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error(
      "No deployer account configured. Please ensure PRIVATE_KEY is set in your .env or .env.local file."
    );
  }

  const deployerAddress = await deployer.getAddress();
  const balance = await ethers.provider.getBalance(deployerAddress);
  console.log(`Deployer address: ${deployerAddress}`);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOT`);

  console.log("Compiling contracts and preparing KeyDrop factory...");
  const KeyDropFactory = await ethers.getContractFactory("KeyDrop");

  console.log("Broadcasting deployment transaction...");
  const keyDrop = await KeyDropFactory.deploy();
  await keyDrop.waitForDeployment();

  const contractAddress = await keyDrop.getAddress();
  const deploymentTx = keyDrop.deploymentTransaction();

  console.log("====================================================");
  console.log("KeyDrop Contract Deployed Successfully!");
  console.log(`Contract Address: ${contractAddress}`);
  if (deploymentTx) {
    console.log(`Transaction Hash: ${deploymentTx.hash}`);
    console.log(`Explorer Link: https://scan.bohr.life/tx/${deploymentTx.hash}`);
  }
  console.log("====================================================");
  console.log("\nNext Steps:");
  console.log("1. Open your .env.local file");
  console.log(`2. Set NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("3. Start your frontend development server with: npm run dev");
  console.log("----------------------------------------------------\n");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
