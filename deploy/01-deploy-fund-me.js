const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config"); // this synatx is similar to the two combined together present below.
// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig

const { network, deployments } = require("hardhat");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async (hre) => {
  const { deploy, log } = await hre.deployments; // hre is hardhat runtime environment. we are taking functions from it.
  const { deployer } = await hre.getNamedAccounts(); // we are getting the deployer from account list that we have
  const chainId = network.config.chainId;

  // if chainId is X use address Y
  // if chainId is Z use address A
  //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  let ethUsdPriceFeedAddress;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  // if the contract doesn't exist, we deploy the minimal version of it for local testing.
  log("-------------------------------------------------------");

  log("Deploying FundMe and waiting for confirmations...");
  const args = [ethUsdPriceFeedAddress];  // Constructorargs must be declared as an array
  const fundMe = await deploy("FundMe", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`FundMe deployed at ${fundMe.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSAN_API_KEY
  ) {
    // VERIFY
    await verify(fundMe.address, args);
  }

  log("-----------------------------------------------");
};

module.exports.tags = ["all", "fundme"];

