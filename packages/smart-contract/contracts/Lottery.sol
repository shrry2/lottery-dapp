// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Lottery is AccessControl {
  bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

  IERC20 public tokenContract;
  uint public ticketPrice;

  event TicketPriceChanged(uint ticketPrice);

  constructor(
    address _tokenAddress,
    uint _ticketPrice
  ) {
    tokenContract = IERC20(_tokenAddress);
    ticketPrice = _ticketPrice;
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
  }

  //---------------------------------------------------------------------------
  // Settings
  //---------------------------------------------------------------------------

  function setTicketPrice(uint _ticketPrice) external {
    require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
    ticketPrice = _ticketPrice;
    emit TicketPriceChanged(_ticketPrice);
  }
}
