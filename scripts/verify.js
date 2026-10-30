const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

async function main() {
  const contractAddress =
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x5BE39A6ba579a7aDc8269B8169Af10a557b5bCD2";

  const sourceCode = fs.readFileSync(
    path.join(__dirname, "../contracts/KeyDrop.sol"),
    "utf8"
  );

  console.log(`Starting verification for KeyDrop at: ${contractAddress}`);

  // 1. Try Blockscout API v2
  console.log("\n[Method 1] Submitting via Blockscout v2 API...");
  try {
    const payloadV2 = {
      compiler_version: "v0.8.20+commit.a1b79de6",
      source_code: sourceCode,
      is_optimization_enabled: true,
      optimization_runs: 200,
      contract_name: "KeyDrop",
      autodetect_constructor_args: false,
      constructor_args: "",
      evm_version: "paris",
      license_type: "mit",
      file_path: "contracts/KeyDrop.sol",
    };

    const resV2 = await fetch(
      `https://scan.botchain.ai/api/v2/smart-contracts/${contractAddress}/verification/via/flattened-code`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadV2),
      }
    );

    const textV2 = await resV2.text();
    console.log("Blockscout v2 Status:", resV2.status);
    console.log("Blockscout v2 Response:", textV2);
  } catch (err) {
    console.log("Method 1 Error:", err.message);
  }

  // 2. Try Standard Etherscan-compatible BOT Chain API
  console.log("\n[Method 2] Submitting via standard Explorer API...");
  try {
    const params = new URLSearchParams({
      module: "contract",
      action: "verifysourcecode",
      contractaddress: contractAddress,
      sourceCode: sourceCode,
      codeformat: "solidity-single-file",
      contractname: "KeyDrop",
      compilerversion: "v0.8.20+commit.a1b79de6",
      optimizationUsed: "1",
      runs: "200",
      constructorArguements: "",
      evmversion: "paris",
      licenseType: "3", // MIT
    });

    const resApi = await fetch("https://scan.botchain.ai/api", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const dataApi = await resApi.json();
    console.log("Standard API Response:", dataApi);

    if (dataApi.status === "1" && dataApi.result) {
      console.log("Checking verification status in 5s...");
      await new Promise((r) => setTimeout(r, 5000));
      const statusRes = await fetch(
        `https://scan.botchain.ai/api?module=contract&action=checkverifystatus&guid=${dataApi.result}`
      );
      const statusData = await statusRes.json();
      console.log("Verification status result:", statusData);
    }
  } catch (err) {
    console.log("Method 2 Error:", err.message);
  }

  // 3. Check contract verification status on Explorer
  console.log("\nChecking contract details on explorer...");
  try {
    const checkRes = await fetch(
      `https://scan.botchain.ai/api/v2/smart-contracts/${contractAddress}`
    );
    if (checkRes.ok) {
      const contractData = await checkRes.json();
      console.log("Is Verified:", contractData.is_verified);
      console.log("Contract Name:", contractData.name);
    }
  } catch (err) {
    console.log("Check Error:", err.message);
  }
}

main().catch(console.error);
