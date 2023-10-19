// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {LibTicket} from "../common/LibTicket.sol";
import {TicketValidatorERC1155} from "./TicketValidatorERC1155.sol";

contract ERC1155Event is ERC1155, TicketValidatorERC1155, ReentrancyGuard {
    address public organizer;
    uint256[3] public prices;

    event Sold(address indexed to, uint256 indexed tokenId);

    constructor(
        string memory name_, 
        string memory uri_,
        address organizer_, 
        uint256[3] memory prices_
    ) 
        ERC1155(uri_) 
        TicketValidatorERC1155(name_, "1")
    {
        organizer = organizer_;
        prices = prices_;
    }

    function buy(uint256 tokenId, address[] memory recipients, uint256[] memory amount) external payable nonReentrant {
        require(recipients.length == amount.length, "Invalid input");
        uint256 totalAmount;
        for (uint256 i = 0; i < recipients.length; i++) {
            totalAmount += amount[i];
            _mint(recipients[i], tokenId, amount[i], "");
        }
        require(msg.value == _getPrice(tokenId) * totalAmount, "Invalid price");
        (bool success, ) = organizer.call{value: msg.value}("");
        require(success, "Failed to send Ether");
        emit Sold(msg.sender, tokenId);
    }

    function use(
        LibTicket.Ticket memory ticket,
        bytes memory signature
    ) external nonReentrant {
        uint256 balance = balanceOf(ticket.owner, ticket.tokenId);
        require(balance > 0, "Invalid balance");
        _validateTicket(balance, ticket, signature);
    }

    function _getPrice(uint256 tokenId) internal view returns (uint256) {
        if (tokenId == 1) {
            return prices[0];
        } else if (tokenId == 2) {
            return prices[1];
        } else if (tokenId == 3) {
            return prices[2];
        } else {
            revert("Invalid tokenId");
        }
    }

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) internal override {
        for (uint256 i = 0; i < ids.length; i++) {
            require(balanceOf(from, ids[i]) >= getUsedTicketsOfUser(from, ids[i]) + values[i], "Sender do not have enough unused tickets");
        }
        super._update(from, to, ids, values);
    }
}