import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { MockToken } from "../typechain-types";

const DECIMAL = 18;

const divByDecimal = (amount: BigNumber) => amount.div(`${10 ** DECIMAL}`);

describe("MockToken", () => {
  let mockToken: MockToken;

  before(async () => {
    const MockToken = await ethers.getContractFactory("MockToken");
    mockToken = (await MockToken.deploy()) as MockToken;
    await mockToken.deployed();
  });

  it("should mint 1000000 MOK as the initial supply", async () => {
    const totalSupply = await mockToken.totalSupply();

    const expectedInitialSupply = "1000000";
    expect(divByDecimal(totalSupply).toString()).to.equal(
      expectedInitialSupply
    );
  });

  it("deployer should hold all the tokens right after deploy", async () => {
    const totalSupply = await mockToken.totalSupply();

    expect(
      await mockToken.balanceOf(await mockToken.signer.getAddress())
    ).to.equal(totalSupply);
  });
});
