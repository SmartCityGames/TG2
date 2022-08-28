// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const SmartCityGames = await hre.ethers.getContractFactory("SmartCityGames");
  const gasPrice = await SmartCityGames.signer.getGasPrice();
  console.log(`Current gas price: ${gasPrice}`);
  const estimatedGas = await SmartCityGames.signer.estimateGas(
    SmartCityGames.getDeployTransaction()
  );
  console.log(`Estimated gas: ${estimatedGas}`);
  const deploymentPrice = gasPrice.mul(estimatedGas);
  const deployerBalance = await SmartCityGames.signer.getBalance();
  console.log(`Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`);
  console.log(`Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`);
  if (Number(deployerBalance) < Number(deploymentPrice)) {
    throw new Error("You dont have enough balance to deploy.");
  }

  const smartCityGames = await SmartCityGames.deploy();

  await smartCityGames.deployed();

  console.log("SmartCityGames deployed to:", smartCityGames.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
