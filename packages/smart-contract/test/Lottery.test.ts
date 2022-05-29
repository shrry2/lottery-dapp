import { expect } from "chai";
import { ethers } from "hardhat";
import { before } from "mocha";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { Lottery, MockToken } from "../typechain-types";

const INITIAL_TICKET_PRICE = 20;

describe("Lottery", () => {
  let owner: SignerWithAddress;
  let manager1: SignerWithAddress;
  let manager2: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  let mockToken: MockToken;

  before(async () => {
    // setup accounts
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    manager1 = accounts[1];
    manager2 = accounts[2];
    user1 = accounts[3];
    user2 = accounts[4];

    // Deploy the MockToken contract
    const MockToken = await ethers.getContractFactory("MockToken");
    mockToken = (await MockToken.deploy()) as MockToken;
    await mockToken.deployed();
  });

  describe("Role-Based Access Control", () => {
    let lottery: Lottery;

    let DEFAULT_ADMIN_ROLE: string;
    let MANAGER_ROLE: string;

    before(async () => {
      // Deploy the Lottery contract
      const Lottery = await ethers.getContractFactory("Lottery");
      lottery = (await Lottery.deploy(
        mockToken.address,
        INITIAL_TICKET_PRICE
      )) as Lottery;
      await lottery.deployed();

      DEFAULT_ADMIN_ROLE = await lottery.DEFAULT_ADMIN_ROLE();
      MANAGER_ROLE = await lottery.MANAGER_ROLE();
    });

    it("should grant admin role to owner after deploy", async () => {
      expect(await lottery.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be
        .true;
      expect(await lottery.hasRole(DEFAULT_ADMIN_ROLE, manager1.address)).to.be
        .false;
    });

    it("should allow owner to set manager1 as manager", async () => {
      expect(await lottery.hasRole(MANAGER_ROLE, manager1.address)).to.be.false;
      await lottery.grantRole(MANAGER_ROLE, manager1.address);
      expect(await lottery.hasRole(MANAGER_ROLE, manager1.address)).to.be.true;
    });

    it("should allow owner to set manager2 as manager", async () => {
      expect(await lottery.hasRole(MANAGER_ROLE, manager2.address)).to.be.false;
      await lottery.grantRole(MANAGER_ROLE, manager2.address);
      expect(await lottery.hasRole(MANAGER_ROLE, manager2.address)).to.be.true;
    });

    it("should allow owner to set ticket price", async () => {
      const newTicketPrice = 100;
      await lottery.connect(owner).setTicketPrice(newTicketPrice);
      const updatedTicketPrice = await lottery.ticketPrice();
      expect(updatedTicketPrice).to.equal(newTicketPrice);
    });

    it("should not allow non-admin to set ticket price", async () => {
      const newTicketPrice = 1000;
      // manager role
      await expect(
        lottery.connect(manager1).setTicketPrice(newTicketPrice)
      ).to.be.revertedWith("Caller is not an admin");

      // no role
      await expect(
        lottery.connect(user1).setTicketPrice(newTicketPrice)
      ).to.be.revertedWith("Caller is not an admin");
    });
  });

  describe("Lottery Functionality", () => {
    let lottery: Lottery;

    before(async () => {
      // Deploy the Lottery contract
      const Lottery = await ethers.getContractFactory("Lottery");
      lottery = (await Lottery.deploy(
        mockToken.address,
        INITIAL_TICKET_PRICE
      )) as Lottery;
      await lottery.deployed();
    });

    it("should set initial ticket price on deploy", async () => {
      const ticketPrice = await lottery.ticketPrice();
      expect(ticketPrice).to.equal(INITIAL_TICKET_PRICE);
    });
  });
});
