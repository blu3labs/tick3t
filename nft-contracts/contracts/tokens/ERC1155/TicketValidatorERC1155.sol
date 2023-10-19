// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {LibTicket} from "../common/LibTicket.sol";

abstract contract TicketValidatorERC1155 is EIP712 {
    using SignatureChecker for address;
    using EnumerableSet for EnumerableSet.UintSet;
    using LibTicket for LibTicket.Ticket;

    mapping (address => mapping (uint256 => uint256)) private _usedTicketsOfUser;

    constructor(string memory name, string memory version) EIP712(name, version) {
    }

    function getUsedTicketsOfUser(address user, uint256 tokenId) public view returns (uint256) {
        return _usedTicketsOfUser[user][tokenId];
    }

    function _validateTicket(
        uint256 balance,
        LibTicket.Ticket memory ticket,
        bytes memory signature
    ) internal {
        require(ticket.owner.isValidSignatureNow(ticket.hash(), signature), "Invalid signature");
        require(ticket.collection == address(this), "Invalid collection");
        require(balance > _usedTicketsOfUser[ticket.owner][ticket.tokenId], "Ticket already used");
        require(ticket.deadline >= block.timestamp, "Ticket expired");
        _usedTicketsOfUser[ticket.owner][ticket.tokenId]++;
    }
}