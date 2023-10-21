// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {IERC1271} from "@openzeppelin/contracts/interfaces/IERC1271.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {LibTicket} from "../common/LibTicket.sol";


abstract contract TicketValidatorERC721 is EIP712 {
    using ECDSA for bytes32;
    using EnumerableSet for EnumerableSet.UintSet;
    using LibTicket for LibTicket.Ticket;

    bytes4 internal constant MAGICVALUE = 0x1626ba7e;
    EnumerableSet.UintSet private _usedTickets;

    constructor(
        string memory name,
        string memory version
    ) EIP712(name, version) {}

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
        bytes32 _hash = ticket.hash();
        if (isContract(owner)) {
            require(
                IERC1271(owner).isValidSignature(
                    _hashTypedDataV4(_hash),
                    signature
                ) == MAGICVALUE,
                "ERC1271 ticket signature verification error"
            );
        } else {
            if (_hashTypedDataV4(_hash).recover(signature) != owner) {
                revert("ECDSA ticket signature verification error");
            } else {
                require(owner != address(0), "Invalid owner");
            }
        }
        require(ticket.collection == address(this), "Invalid collection");
        require(!_usedTickets.contains(ticket.tokenId), "Ticket already used");
        require(ticket.deadline >= block.timestamp, "Ticket expired");
        _usedTickets.add(ticket.tokenId);
    }

    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}
