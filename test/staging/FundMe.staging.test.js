const { ethers, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

// below is a one liner if statement. if the condition is true then describe .skip will occur.
developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function () {
      let deployer;
      let fundMe;
      const sendValue = ethers.utils.parseEther("0.01");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
      });
      it("Allows people to fund and withdraw", async function () {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingBalance = await fundMe.provider.getBalance(fundMe.address);

        assert.equal(endingBalance.toString(), 0);
      });
    });
