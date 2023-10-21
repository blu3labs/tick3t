// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {LibTicket} from "../common/LibTicket.sol";

abstract contract TicketValidatorERC1155 is EIP712 {
    using ECDSA for bytes32;
    using EnumerableSet for EnumerableSet.UintSet;
    using LibTicket for LibTicket.Ticket;

    bytes4 internal constant MAGICVALUE = 0x1626ba7e;

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
        bytes32 _hash = ticket.hash();
        if (isContract(ticket.owner)) {
            require(
                IERC1271(ticket.owner).isValidSignature(
                    _hashTypedDataV4(_hash),
                    signature
                ) == MAGICVALUE,
                "ERC1271 ticket signature verification error"
            );
        } else {
            if (_hashTypedDataV4(_hash).recover(signature) != ticket.owner) {
                revert("ECDSA ticket signature verification error");
            } else {
                require(ticket.owner != address(0), "Invalid owner");
            }
        }
        require(ticket.collection == address(this), "Invalid collection");
        require(balance > _usedTicketsOfUser[ticket.owner][ticket.tokenId], "Ticket already used");
        require(ticket.deadline >= block.timestamp, "Ticket expired");
        _usedTicketsOfUser[ticket.owner][ticket.tokenId]++;
    }

    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}