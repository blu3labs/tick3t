// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {LibTicket} from "../common/LibTicket.sol";
import {IEvent} from "../common/IEvent.sol";
import {TicketValidatorERC1155} from "./TicketValidatorERC1155.sol";

contract ERC1155Event is ERC1155, IEvent, TicketValidatorERC1155, ReentrancyGuard {
    using Address for address payable;
    using EnumerableSet for EnumerableSet.UintSet;
    using Strings for address;

    address payable public immutable organizer;
    address payable public immutable feeRecipient;
    uint256 public immutable serviceFee;
    uint256 public immutable date;
    uint256[3] public prices;

    mapping(address => EnumerableSet.UintSet) private _userTickets;

    event Sold(address indexed to, uint256 indexed tokenId, uint256 amount);

    constructor(
        string memory name_,
        string memory uri_,
        address payable organizer_,
        address payable feeRecipient_,
        uint256 serviceFee_,
        uint256 date_,
        uint256[3] memory prices_
    ) ERC1155(uri_) TicketValidatorERC1155(name_, "1") {
        organizer = organizer_;
        feeRecipient = feeRecipient_;
        serviceFee = serviceFee_;
        date = date_;
        prices = prices_;
        _setURI(string.concat(uri_, address(this).toHexString()));
    }

    modifier whenNotEnded() {
        require(block.timestamp < date, "Event ended");
        _;
    }

    function buy(
        uint256 tokenId,
        address[] memory recipients,
        uint256[] memory amount
    ) external payable nonReentrant whenNotEnded {
        require(recipients.length == amount.length, "Invalid input");
        uint256 totalAmount;
        for (uint256 i = 0; i < recipients.length; i++) {
            totalAmount += amount[i];
            _mint(recipients[i], tokenId, amount[i], "");
            _userTickets[recipients[i]].add(tokenId);
            emit Sold(recipients[i], tokenId, amount[i]);
        }
        require(
            msg.value == (_getPrice(tokenId) * totalAmount) + serviceFee,
            "Invalid price"
        );
        feeRecipient.sendValue(serviceFee);
        organizer.sendValue(msg.value - serviceFee);
    }

    function use(
        LibTicket.Ticket memory ticket,
        bytes memory signature
    ) external nonReentrant whenNotEnded {
        uint256 balance = balanceOf(ticket.owner, ticket.tokenId);
        require(balance > 0, "Invalid balance");
        _validateTicket(balance, ticket, signature);
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
                tokenUri: uri(0),
                tokenId: tokenId,
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

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override whenNotEnded {
        for (uint256 i = 0; i < ids.length; i++) {
            require(
                balanceOf(from, ids[i]) >=
                    getUsedTicketsOfUser(from, ids[i]) + values[i] ||
                    from == address(0),
                "Sender do not have enough unused tickets"
            );
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
