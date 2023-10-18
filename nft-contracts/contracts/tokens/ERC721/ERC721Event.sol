// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {LibTicket} from "../common/LibTicket.sol";
import {TicketValidatorERC721} from "./TicketValidatorERC721.sol";

contract ERC721Event is ERC721, TicketValidatorERC721, ReentrancyGuard {
    address public organizer;
    uint256[3] public prices;
    string private _uri;

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
        return super._update(to, tokenId, auth);
    }
}