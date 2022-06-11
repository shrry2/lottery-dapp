// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract Lottery is AccessControl {
  using SafeMath for uint256;

  /* ============ Variables ============ */

  // roles
  bytes32 public constant MANAGER_ROLE = keccak256('MANAGER_ROLE');

  // contract of MockToken
  IERC20 public mockToken;

  // address of the prize pool
  address payable public prizePoolAddress;

  // price of a ticket
  uint256 public ticketPrice;

  // fee of the lottery
  uint256 public feeRate = 500; // 5% in two decimal places

  // the time when the last lottery was drawn
  uint256 public lastDrawn = 0;

  // purchaser array of the current lottery
  address[] private players;

  /* ============ Events ============ */

  event TicketPriceChanged(uint256 ticketPrice);
  event FeeRateChanged(uint256 feeRate);
  event TicketPurchased(address buyer, uint256 ticketAmount, uint256 totalCost);
  event Drawn(address winner, uint256 prizeAmount);
  event Withdrawn(uint256 feeAmount);

  /* ============ Constructor ============ */

  constructor(
    address _mockTokenAddress,
    address payable _prizePoolAddress,
    uint256 _ticketPrice,
    uint256 _feeRate
  ) {
    mockToken = IERC20(_mockTokenAddress);
    // make sure the balance of prize pool is zero
    require(mockToken.balanceOf(prizePoolAddress) == 0);
    prizePoolAddress = _prizePoolAddress;
    ticketPrice = _ticketPrice;
    feeRate = _feeRate;
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  /* ============ External Functions ============ */

  // buy ticket
  function buyTicket(uint256 _ticketAmount) external {
    require(_ticketAmount > 0, 'Ticket amount must be greater than 0');
    uint256 totalCost = ticketPrice.mul(_ticketAmount);
    require(
      mockToken.balanceOf(msg.sender) >= totalCost,
      "You don't have enough tokens"
    );
    uint256 fee = totalCost.mul(feeRate).div(10000);
    // transfer fee to this contract
    mockToken.transferFrom(msg.sender, address(this), fee);
    uint256 remaining = totalCost.sub(fee);
    // transfer remaining to prize pool
    mockToken.transferFrom(msg.sender, prizePoolAddress, remaining);
    // add player to the list
    for (uint256 i = 0; i < _ticketAmount; i++) {
      players.push(msg.sender);
    }
    emit TicketPurchased(msg.sender, _ticketAmount, totalCost);
  }

  // purchased tickets
  function ticketsOf(address _player) external view returns (uint256) {
    uint256 count = 0;
    for (uint256 i = 0; i < players.length; i++) {
      if (players[i] == _player) {
        count++;
      }
    }
    return count;
  }

  /* ============ Admin Functions ============ */

  // set ticket price
  function setTicketPrice(uint256 _ticketPrice) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 'Caller is not an admin');
    ticketPrice = _ticketPrice;
    emit TicketPriceChanged(_ticketPrice);
  }

  // set fee rate
  function setFeeRate(uint256 _feeRate) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 'Caller is not an admin');
    require(_feeRate <= 10000, 'Fee rate must be 10000 or less');
    feeRate = _feeRate;
    emit FeeRateChanged(_feeRate);
  }

  // draw lottery
  function draw() external {
    require(
      hasRole(DEFAULT_ADMIN_ROLE, msg.sender) ||
        hasRole(MANAGER_ROLE, msg.sender),
      'Caller is neither an admin nor a manager'
    );
    require(players.length > 0, 'No players have purchased tickets');

    // check if 5 minutes have passed since the last draw
    uint256 currentTime = block.timestamp;
    require(
      currentTime >= lastDrawn + 5 minutes,
      'You can only draw once every 5 minutes'
    );

    // prize payment

    // determine winner
    address winner = _pickWinner();
    // winner gets all of the prize pool
    uint256 prizeAmount = mockToken.balanceOf(prizePoolAddress);
    mockToken.transferFrom(prizePoolAddress, winner, prizeAmount);

    // update contract state

    // clear players
    delete players;
    // update last drawn time
    lastDrawn = currentTime;

    // emit event
    emit Drawn(winner, prizeAmount);
  }

  // withdraw fee
  function withdraw() external {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), 'Caller is not an admin');
    uint256 feeAmount = mockToken.balanceOf(address(this));
    // transfer all the token stored in this contract to admin
    mockToken.transfer(msg.sender, feeAmount);
    emit Withdrawn(feeAmount);
  }

  /* ============ Internal Functions ============ */

  // pick a random player from the list
  function _pickWinner() internal view returns (address) {
    // generate random between 0 and players.length - 1
    uint256 winnerIndex = _random() % players.length;
    return players[winnerIndex];
  }

  // generate a pseudo random number
  function _random() internal view returns (uint256) {
    return
      uint256(
        keccak256(abi.encodePacked(block.difficulty, block.timestamp, players))
      );
  }
}
