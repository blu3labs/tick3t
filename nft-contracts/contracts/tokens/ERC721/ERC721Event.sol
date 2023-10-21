// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {LibTicket} from "../common/LibTicket.sol";
import {IEvent} from "../common/IEvent.sol";
import {TicketValidatorERC721} from "./TicketValidatorERC721.sol";

contract ERC721Event is ERC721, IEvent, TicketValidatorERC721, ReentrancyGuard {
    using Address for address payable;
    using EnumerableSet for EnumerableSet.UintSet;
    using Strings for address;

    address payable public immutable organizer;
    address payable public immutable feeRecipient;
    uint256 public immutable serviceFee;
    uint256 public immutable date;
    uint256[3] public prices;
    string private _uri;
    EnumerableSet.UintSet private _soldTickets;

    mapping(address => EnumerableSet.UintSet) private _userTickets;

    event Sold(address indexed to, uint256 indexed tokenId);

    constructor(
        string memory name_,
        address payable organizer_,
        address payable feeRecipient_,
        uint256 serviceFee_,
        uint256 date_,
        uint256[3] memory prices_
    ) ERC721(name_, name_) TicketValidatorERC721(name_, "1") {
        _uri = address(this).toHexString();
        organizer = organizer_;
        feeRecipient = feeRecipient_;
        serviceFee = serviceFee_;
        date = date_;
        prices = prices_;
    }

    modifier whenNotEnded() {
        require(block.timestamp < date, "Event ended");
        _;
    }

    function buy(
        uint256[] memory tokenIds,
        address[] memory recipients
    ) external payable nonReentrant whenNotEnded {
        require(recipients.length == tokenIds.length, "Invalid input");
        uint256 totalPrice;
        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(tokenId > 0 && tokenId <= 90, "Invalid tokenId");
            _safeMint(recipients[i], tokenId);
            _userTickets[recipients[i]].add(tokenId);
            _soldTickets.add(tokenId);
            totalPrice += _getPrice(tokenId);
            emit Sold(recipients[i], tokenId);
        }
        require(msg.value == totalPrice + serviceFee, "Invalid msg.value");
        feeRecipient.sendValue(serviceFee);
        organizer.sendValue(totalPrice);
    }

    function use(
        LibTicket.Ticket memory ticket,
        bytes memory signature
    ) external nonReentrant whenNotEnded {
        address owner = ownerOf(ticket.tokenId);
        require(owner == ticket.owner, "Invalid owner");
        _validateTicket(owner, ticket, signature);
    }

    function getUserTickets(
        address user
    ) external view returns (LibTicket.TicketInfo[] memory) {
        uint256 length = _userTickets[user].length();
        LibTicket.TicketInfo[] memory tickets = new LibTicket.TicketInfo[](
            length
        );
        for (uint256 i = 0; i < length; i++) {
            uint256 tokenId = _userTickets[user].at(i);
            tickets[i] = LibTicket.TicketInfo({
                tokenUri: _baseURI(),
                tokenId: tokenId,
                amount: 1,
                usedAmount: isUsedTicket(tokenId) ? 1 : 0
            });
        }
        return tickets;
    }

    function getSoldTickets() external view returns (uint256[] memory) {
        return _soldTickets.values();
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

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override whenNotEnded returns (address) {
        require(!isUsedTicket(tokenId), "Ticket already used");
        address from = _ownerOf(tokenId);
        if (from != address(0)) {
            _userTickets[from].remove(tokenId);
        }
        if (to != address(0)) {
            _userTickets[to].add(tokenId);
        }
        return super._update(to, tokenId, auth);
    }
}
