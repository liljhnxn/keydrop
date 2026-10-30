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
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");

  console.log(`Deployer address: ${deployerAddress}`);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} BOT`);
  console.log(`Network gas price: ${ethers.formatUnits(gasPrice, "gwei")} gwei`);

  console.log("Compiling contracts and preparing KeyDrop factory...");
  const KeyDropFactory = await ethers.getContractFactory("KeyDrop");

  // Estimate gas
  const deployTx = await KeyDropFactory.getDeployTransaction();
  const estimatedGas = await ethers.provider.estimateGas(deployTx);
  const estimatedCost = estimatedGas * gasPrice;
  console.log(`Estimated gas units: ${estimatedGas.toString()}`);
  console.log(`Estimated deployment fee: ${ethers.formatEther(estimatedCost)} BOT`);

  console.log("Broadcasting deployment transaction...");
  // Explicitly specify gasPrice to ensure no overpaying
  const keyDrop = await KeyDropFactory.deploy({
    gasPrice: gasPrice,
  });
  await keyDrop.waitForDeployment();

  const contractAddress = await keyDrop.getAddress();
  const deploymentTx = keyDrop.deploymentTransaction();

  const explorerBase = "https://scan.botchain.ai";

  console.log("====================================================");
  console.log("KeyDrop Contract Deployed Successfully!");
  console.log(`Contract Address: ${contractAddress}`);
  if (deploymentTx) {
    console.log(`Transaction Hash: ${deploymentTx.hash}`);
    console.log(`Explorer Link: ${explorerBase}/tx/${deploymentTx.hash}`);
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
