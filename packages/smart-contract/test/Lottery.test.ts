import { expect, use } from 'chai';
import { solidity } from 'ethereum-waffle';
import { ethers } from 'hardhat';
import { before } from 'mocha';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { Lottery, MockToken } from '../typechain-types';
import { ContractTransaction } from 'ethers';

use(solidity);

const TICKET_PRICE = 20;
const FEE_RATE = 500;
const APPROVE_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'; //(2^256 - 1 )

describe('Lottery', () => {
  let owner: SignerWithAddress;
  let manager1: SignerWithAddress;
  let manager2: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let prizePool: SignerWithAddress;

  before(async () => {
    // setup accounts
    const accounts = await ethers.getSigners();
    owner = accounts[0];
    manager1 = accounts[1];
    manager2 = accounts[2];
    user1 = accounts[3];
    user2 = accounts[4];
    prizePool = accounts[5];
  });

  /**
   * Deploy contracts
   */

  let mockToken: MockToken;

  let lottery: Lottery;
  let DEFAULT_ADMIN_ROLE: string;
  let MANAGER_ROLE: string;

  beforeEach(async () => {
    // Deploy the MockToken contract
    const MockToken = await ethers.getContractFactory('MockToken');
    mockToken = (await MockToken.deploy()) as MockToken;
    await mockToken.deployed();

    // Deploy the Lottery contract
    const Lottery = await ethers.getContractFactory('Lottery');
    lottery = (await Lottery.deploy(
      mockToken.address,
      prizePool.address,
      TICKET_PRICE,
      FEE_RATE
    )) as Lottery;
    await lottery.deployed();

    DEFAULT_ADMIN_ROLE = await lottery.DEFAULT_ADMIN_ROLE();
    MANAGER_ROLE = await lottery.MANAGER_ROLE();

    // approve lottery contract to spend tokens of prize pool
    await mockToken.connect(prizePool).approve(lottery.address, APPROVE_AMOUNT);
  });

  describe('Constructor', () => {
    it('should set initial ticket price on deploy', async () => {
      const ticketPrice = await lottery.ticketPrice();
      expect(ticketPrice).to.equal(TICKET_PRICE);
    });

    it('should set fee rate on deploy', async () => {
      const feeRate = await lottery.feeRate();
      expect(feeRate).to.equal(FEE_RATE);
    });
  });

  // test utils
  const purchaseTickets = async (
    purchaser: SignerWithAddress,
    amount: number
  ) => {
    const requiredFunds = (await lottery.ticketPrice()).toNumber() * amount;
    await mockToken.connect(owner).transfer(purchaser.address, requiredFunds);
    await mockToken.connect(purchaser).approve(lottery.address, requiredFunds);
    await lottery.connect(purchaser).buyTicket(amount);
  };

  describe('Access Control', () => {
    /**
     * Role Granting
     */

    it('should grant admin role to owner after deploy', async () => {
      expect(await lottery.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be
        .true;
      expect(await lottery.hasRole(DEFAULT_ADMIN_ROLE, manager1.address)).to.be
        .false;
    });

    it('should allow owner to set manager1 as manager', async () => {
      expect(await lottery.hasRole(MANAGER_ROLE, manager1.address)).to.be.false;
      await lottery.grantRole(MANAGER_ROLE, manager1.address);
      expect(await lottery.hasRole(MANAGER_ROLE, manager1.address)).to.be.true;
    });

    it('should allow owner to set manager2 as manager', async () => {
      expect(await lottery.hasRole(MANAGER_ROLE, manager2.address)).to.be.false;
      await lottery.grantRole(MANAGER_ROLE, manager2.address);
      expect(await lottery.hasRole(MANAGER_ROLE, manager2.address)).to.be.true;
    });

    /**
     * setTicketPrice
     */

    it('should allow owner to set ticket price', async () => {
      const newTicketPrice = 100;
      await expect(lottery.connect(owner).setTicketPrice(newTicketPrice))
        .to.emit(lottery, 'TicketPriceChanged')
        .withArgs(newTicketPrice);
      const updatedTicketPrice = await lottery.ticketPrice();
      expect(updatedTicketPrice).to.equal(newTicketPrice);
    });

    it('should not allow non-admin to set ticket price', async () => {
      const newTicketPrice = 1000;
      // manager role
      await expect(
        lottery.connect(manager1).setTicketPrice(newTicketPrice)
      ).to.be.revertedWith('Caller is not an admin');

      // no role
      await expect(
        lottery.connect(user1).setTicketPrice(newTicketPrice)
      ).to.be.revertedWith('Caller is not an admin');
    });

    /**
     * setFeeRate
     */

    it('should allow owner to set fee rate', async () => {
      const newFeeRate = 1000;
      await expect(lottery.connect(owner).setFeeRate(newFeeRate))
        .to.emit(lottery, 'FeeRateChanged')
        .withArgs(newFeeRate);
      const updatedFeeRate = await lottery.feeRate();
      expect(updatedFeeRate).to.equal(newFeeRate);
    });

    it('should not allow setting invalid fee rate', async () => {
      // negative
      await expect(lottery.connect(owner).setFeeRate(-500)).to.be.reverted;
      // over 10000
      await expect(lottery.connect(owner).setFeeRate(10001)).to.be.revertedWith(
        'Fee rate must be 10000 or less'
      );
    });
  });

  describe('For Users', () => {
    it('should not allow user1 without budget to buy 1 ticket', async () => {
      await expect(lottery.connect(user1).buyTicket(1)).to.be.revertedWith(
        "You don't have enough tokens"
      );
    });

    it('should not allow user1 without enough budget to buy 2 tickets', async () => {
      // transfer tokens only enough to buy 1 ticket
      await mockToken.connect(owner).transfer(user1.address, TICKET_PRICE);
      expect(await mockToken.balanceOf(user1.address)).to.equal(TICKET_PRICE);
      // Allow Lottery to spend tokens
      await mockToken.connect(user1).approve(lottery.address, TICKET_PRICE);
      await expect(lottery.connect(user1).buyTicket(2)).to.be.revertedWith(
        "You don't have enough tokens"
      );
    });

    it('should allow user1 with exact budget to buy 1 ticket', async () => {
      // transfer tokens only enough to buy 1 ticket
      await mockToken.connect(owner).transfer(user1.address, TICKET_PRICE);
      expect(await mockToken.balanceOf(user1.address)).to.equal(TICKET_PRICE);
      // Allow Lottery to spend tokens
      await mockToken.connect(user1).approve(lottery.address, TICKET_PRICE);
      await expect(lottery.connect(user1).buyTicket(1))
        .to.emit(lottery, 'TicketPurchased')
        .withArgs(user1.address, 1, TICKET_PRICE);
      // check if user1 has 1 ticket
      expect(await lottery.ticketsOf(user1.address)).to.equal(1);
    });

    it('should allow user1 to buy 100 tickets', async () => {
      // transfer plenty of tokens
      await mockToken.connect(owner).transfer(user1.address, 10000);
      expect(await mockToken.balanceOf(user1.address)).to.gte(10000);
      // Allow Lottery to spend all tokens
      await mockToken.connect(user1).approve(lottery.address, APPROVE_AMOUNT);
      await expect(lottery.connect(user1).buyTicket(100))
        .to.emit(lottery, 'TicketPurchased')
        .withArgs(user1.address, 100, TICKET_PRICE * 100);
      // check if user1 has 100 tickets
      expect(await lottery.ticketsOf(user1.address)).to.equal(100);
    });

    it('should allow multiple users to buy tickets', async () => {
      // transfer plenty of tokens
      await mockToken.connect(owner).transfer(user1.address, 10000);
      expect(await mockToken.balanceOf(user1.address)).to.gte(10000);
      await mockToken.connect(owner).transfer(user2.address, 10000);
      expect(await mockToken.balanceOf(user2.address)).to.gte(10000);
      // Allow Lottery to spend all tokens
      await mockToken.connect(user1).approve(lottery.address, APPROVE_AMOUNT);
      await mockToken.connect(user2).approve(lottery.address, APPROVE_AMOUNT);

      // buy 100 tickets for user1
      await expect(lottery.connect(user1).buyTicket(100))
        .to.emit(lottery, 'TicketPurchased')
        .withArgs(user1.address, 100, TICKET_PRICE * 100);
      // check if user1 has 100 tickets
      expect(await lottery.ticketsOf(user1.address)).to.equal(100);

      // buy 200 tickets for user2
      await expect(lottery.connect(user2).buyTicket(200))
        .to.emit(lottery, 'TicketPurchased')
        .withArgs(user2.address, 200, TICKET_PRICE * 200);
      // check if user1 has 100 tickets
      expect(await lottery.ticketsOf(user2.address)).to.equal(200);
    });

    it('should store fee in the contract', async () => {
      // buy 100 tickets for user1
      await purchaseTickets(user1, 100);

      const paidAmount = TICKET_PRICE * 100;
      const feeAmount = (paidAmount * FEE_RATE) / 10000;

      // check if fee is stored in the contract
      expect(await mockToken.balanceOf(lottery.address)).to.equal(feeAmount);
    });

    it('should transfer prize amount to prize pool', async () => {
      // buy 100 tickets for user1
      await purchaseTickets(user1, 100);

      const paidAmount = TICKET_PRICE * 100;
      const feeAmount = (paidAmount * FEE_RATE) / 10000;
      const prizePoolAmount = paidAmount - feeAmount;

      // check if prize pool is stored in prize pool wallet
      expect(await mockToken.balanceOf(prizePool.address)).to.equal(
        prizePoolAmount
      );
    });
  });

  describe('Draw', () => {
    // access control
    it('should not allow non-owner to draw', async () => {
      await expect(lottery.connect(user1).draw()).to.be.revertedWith(
        'Caller is neither an admin nor a manager'
      );
    });

    it('should not allow to draw if there are no players', async () => {
      await expect(lottery.draw()).to.be.revertedWith(
        'No players have purchased tickets'
      );
    });

    const getDrawResultByDrawTransaction = async (
      drawTransaction: ContractTransaction
    ): Promise<{
      winner: string;
      prizeAmount: number;
    }> => {
      const drawTransactionReceipt = await drawTransaction.wait();
      const { events } = drawTransactionReceipt;
      if (!events) {
        throw new Error('No events emitted');
      }
      const drawnEvent = events.find((ev) => ev.event === 'Drawn');
      if (!drawnEvent || !drawnEvent.decode) {
        throw new Error('No drawn event emitted');
      }
      const drawnEventDecoded = drawnEvent.decode(drawnEvent.data);
      const [winner, prizeAmount] = drawnEventDecoded;

      return {
        winner,
        prizeAmount,
      };
    };

    // token transfer

    it('should pick the winner and transfer the prize to it', async () => {
      await purchaseTickets(user1, 100);
      const balanceBeforeDraw = await mockToken.balanceOf(user1.address);
      const totalPaidAmount = (await lottery.ticketPrice()).toNumber() * 100;
      const feeAmount = (totalPaidAmount * FEE_RATE) / 10000;
      const prizeAmount = totalPaidAmount - feeAmount;
      // draw the lottery
      const drawTransaction = await lottery.draw();
      const drawResult = await getDrawResultByDrawTransaction(drawTransaction);
      expect(prizeAmount).to.eq(drawResult.prizeAmount);
      // check if prize is transferred to the winner
      expect(await mockToken.balanceOf(drawResult.winner)).to.eq(
        balanceBeforeDraw.add(prizeAmount)
      );
    });

    it('should keep the fee in the contract', async () => {
      await purchaseTickets(user1, 100);
      const totalPaidAmount = (await lottery.ticketPrice()).toNumber() * 100;
      const feeAmount = (totalPaidAmount * FEE_RATE) / 10000;
      const lotteryBalanceBeforeDraw = await mockToken.balanceOf(
        lottery.address
      );
      expect(lotteryBalanceBeforeDraw).to.eq(feeAmount);
      // draw the lottery
      await lottery.draw();
      // check if fee is transferred to the winner
      expect(await mockToken.balanceOf(lottery.address)).to.eq(
        lotteryBalanceBeforeDraw
      );
    });

    // cool down

    it('should not allow to draw if cool down is not enough', async () => {
      await purchaseTickets(user1, 1);
      // draw once
      await lottery.draw().then((t) => t.wait());
      await purchaseTickets(user1, 1);
      // draw again immediately
      await expect(lottery.draw()).to.be.revertedWith(
        'You can only draw once every 5 minutes'
      );
    });

    it('should allow to draw again if cool down has finished', async () => {
      await purchaseTickets(user1, 1);
      // draw once
      await lottery.draw();
      // forward time to 5 minutes after the draw
      await ethers.provider.send('evm_increaseTime', [5 * 60]);
      await ethers.provider.send('evm_mine', []);
      await purchaseTickets(user1, 1);
      // draw again
      await expect(lottery.draw()).not.to.be.reverted;
    });

    // state reset

    it('should reset player list after draw', async () => {
      // purchase tickets and check if tickets are stored
      await purchaseTickets(user1, 1);
      await purchaseTickets(user2, 1);
      expect(await lottery.ticketsOf(user1.address)).to.eq(1);
      expect(await lottery.ticketsOf(user2.address)).to.eq(1);

      // draw the lottery
      await lottery.draw();

      // check if player list is reset
      expect(await lottery.ticketsOf(user1.address)).to.eq(0);
      expect(await lottery.ticketsOf(user2.address)).to.eq(0);
    });

    it('should update last drawn timestamp', async () => {
      expect(await lottery.lastDrawn()).to.eq(0);
      await purchaseTickets(user1, 1);
      // draw the lottery and get the timestamp of the block when it was drawn
      const txReceipt = await lottery.draw().then((tx) => tx.wait());
      const lastDrawnTimestamp = await ethers.provider
        .getBlock(txReceipt.blockNumber)
        .then((block) => block.timestamp);
      // check if last drawn timestamp is updated
      expect(await lottery.lastDrawn()).to.eq(lastDrawnTimestamp);
    });
  });

  describe('Withdraw', () => {
    // access control

    it('should allow owner to withdraw', async () => {
      await expect(lottery.connect(owner).withdraw()).not.to.be.reverted;
    });

    it('should not allow non-owner to withdraw', async () => {
      await expect(lottery.connect(user1).withdraw()).to.be.revertedWith(
        'Caller is not an admin'
      );
      await expect(lottery.connect(manager1).withdraw()).to.be.revertedWith(
        'Caller is not an admin'
      );
    });

    it('should transfer fee to owner', async () => {
      // purchase tickets
      await purchaseTickets(user1, 100);
      await purchaseTickets(user2, 100);
      const totalPaidAmount = (await lottery.ticketPrice()).toNumber() * 200;
      const feeAmount = (totalPaidAmount * FEE_RATE) / 10000;
      const ownerBalanceBeforeDraw = await mockToken.balanceOf(owner.address);

      // withdraw fee
      await expect(lottery.connect(owner).withdraw())
        .to.emit(lottery, 'Withdrawn')
        .withArgs(feeAmount);

      // check if fee is transferred to the owner
      expect(await mockToken.balanceOf(owner.address)).to.eq(
        ownerBalanceBeforeDraw.add(feeAmount)
      );
    });
  });
});
