// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {LibTicket} from "../common/LibTicket.sol";
import {TicketValidatorERC721} from "./TicketValidatorERC721.sol";

contract ERC721Event is ERC721, TicketValidatorERC721, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.UintSet;

    address public organizer;
    uint256[3] public prices;
    string private _uri;

    mapping (address => EnumerableSet.UintSet) private _userTickets;

    event Sold(address indexed to, uint256 indexed tokenId);

    constructor(
        string memory name_, 
        string memory uri_,
        address organizer_, 
        uint256[3] memory prices_
    ) 
        ERC721(name_, name_) 
        TicketValidatorERC721(name_, "1")
    {   
        _uri = uri_;
        organizer = organizer_;
        prices = prices_;
    }

    function buy(uint256 tokenId) external payable nonReentrant {
        require(tokenId > 0 && tokenId <= 90, "Invalid tokenId");
        require(msg.value == _getPrice(tokenId), "Invalid msg.value");
        (bool success, ) = organizer.call{value: msg.value}("");
        require(success, "Failed to send Ether");
        _safeMint(msg.sender, tokenId);
        _userTickets[msg.sender].add(tokenId);
        emit Sold(msg.sender, tokenId);
    }

    function use(
        LibTicket.Ticket memory ticket,
        bytes memory signature
    ) external nonReentrant {
        address owner = ownerOf(ticket.tokenId);
        require(owner == ticket.owner, "Invalid owner");
        _validateTicket(owner, ticket, signature);
    }

    function getUserTickets(address user) external view returns (LibTicket.TicketInfo[] memory) {
        uint256 length = _userTickets[user].length();
        LibTicket.TicketInfo[] memory tickets = new LibTicket.TicketInfo[](length);
        for (uint256 i = 0; i < length; i++) {
            uint256 tokenId = _userTickets[user].at(i);
            tickets[i] = LibTicket.TicketInfo({
                tokenUri: tokenURI(tokenId),
                amount: 1,
                usedAmount: isUsedTicket(tokenId) ? 1 : 0
            });
        }
        return tickets;
    }

    function _getPrice(uint256 tokenId) internal view returns (uint256) {
        if (tokenId <= 30) {
            return prices[0];
        } else if (tokenId <= 60) {
            return prices[1];
        } else if (tokenId <= 90) {
            return prices[2];
        } else {
            revert("Invalid tokenId");
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return _uri;
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        require(!isUsedTicket(tokenId), "Ticket already used");
        address from = ownerOf(tokenId);
        if (from != address(0)) {
            _userTickets[from].remove(tokenId);
        }
        if (to != address(0)) {
            _userTickets[to].add(tokenId);
        }
        return super._update(to, tokenId, auth);
    }
}