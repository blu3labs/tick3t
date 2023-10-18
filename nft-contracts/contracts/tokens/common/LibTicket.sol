// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

library LibTicket {
    bytes32 constant TICKET_TYPEHASH = keccak256("Ticket(address owner,address collection,uint256 tokenId,uint256 amount,uint256 deadline,uint256 salt)");

    struct Ticket {
        address owner;
        address collection;
        uint256 tokenId;
        uint256 amount;
        uint256 deadline;
        uint256 salt;
    }

    function hash(Ticket memory ticket) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            TICKET_TYPEHASH,
            ticket.owner,
            ticket.collection,
            ticket.tokenId,
            ticket.amount,
            ticket.deadline,
            ticket.salt
        ));
    }
}