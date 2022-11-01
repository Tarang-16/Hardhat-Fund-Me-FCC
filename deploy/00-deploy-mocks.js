const { network } = require("hardhat");
const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments; // hre is hardhat runtime environment. we are taking functions from it.
  const { deployer } = await getNamedAccounts(); // we are getting the deployer from account list that we have

  if (developmentChains.includes(network.name)) {
    console.log("Local network detected! Deploying mocks...");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocksdeployed!");
    log("---------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
