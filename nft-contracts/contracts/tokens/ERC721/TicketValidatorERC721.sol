// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {SignatureChecker} from "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {LibTicket} from "../common/LibTicket.sol";

abstract contract TicketValidatorERC721 is EIP712 {
    using SignatureChecker for address;
    using EnumerableSet for EnumerableSet.UintSet;
    using LibTicket for LibTicket.Ticket;

    EnumerableSet.UintSet private _usedTickets;

    constructor(string memory name, string memory version) EIP712(name, version) {
    }

    function getUsedTickets() external view returns (uint256[] memory) {
        return _usedTickets.values();
    }

    function isUsedTicket(uint256 tokenId) public view returns (bool) {
        return _usedTickets.contains(tokenId);
    }

    function _validateTicket(
        address owner,
        LibTicket.Ticket memory ticket,
        bytes memory signature
    ) internal {
        require(owner.isValidSignatureNow(ticket.hash(), signature), "Invalid signature");
        require(ticket.collection == address(this), "Invalid collection");
        require(!_usedTickets.contains(ticket.tokenId), "Ticket already used");
        require(ticket.amount == 1, "Invalid amount");
        require(ticket.deadline >= block.timestamp, "Ticket expired");
        _usedTickets.add(ticket.tokenId);
    }
}