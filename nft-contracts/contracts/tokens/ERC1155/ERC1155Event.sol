// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {LibTicket} from "../common/LibTicket.sol";
import {TicketValidatorERC1155} from "./TicketValidatorERC1155.sol";

contract ERC1155Event is ERC1155, TicketValidatorERC1155, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.UintSet;
    using Strings for uint256;

    address public organizer;
    uint256[3] public prices;

    mapping (address => EnumerableSet.UintSet) private _userTickets;

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
            _userTickets[recipients[i]].add(tokenId);
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

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        string memory baseURI = uri(0);
        return bytes(baseURI).length > 0 ? string.concat(baseURI, tokenId.toString()) : "";
    }

    function getUserTickets(address user) external view returns (LibTicket.TicketInfo[] memory) {
        uint256 length = _userTickets[user].length();
        LibTicket.TicketInfo[] memory tickets = new LibTicket.TicketInfo[](length);
        for (uint256 i = 0; i < length; i++) {
            uint256 tokenId = _userTickets[user].at(i);
            tickets[i] = LibTicket.TicketInfo({
                tokenUri: tokenURI(tokenId),
                amount: balanceOf(user, tokenId),
                usedAmount: getUsedTicketsOfUser(user, tokenId)
            });
        }
        return tickets;
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
        if (from != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                if (balanceOf(from, ids[i]) == values[i]) {
                    _userTickets[from].remove(ids[i]);
                }
            }
        }
        if (to != address(0)) {
            for (uint256 i = 0; i < ids.length; i++) {
                _userTickets[to].add(ids[i]);
            }
        }
        super._update(from, to, ids, values);
    }
}