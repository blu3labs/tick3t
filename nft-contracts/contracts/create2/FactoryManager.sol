// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IFactory} from "./common/IFactory.sol";
import {LibTicket} from "../tokens/common/LibTicket.sol";
import {IEvent} from "../tokens/common/IEvent.sol";

contract FactoryManager is Ownable {
    address payable public feeRecipient;
    uint256 public serviceFee;

    IFactory public ERC721Factory;
    IFactory public ERC1155Factory;

    address[] public events;

    constructor(
        address payable feeRecipient_,
        uint256 serviceFee_
    ) Ownable(msg.sender) {
        feeRecipient = feeRecipient_;
        serviceFee = serviceFee_;
    }

    event ERC721EventCreated(address indexed eventContract);
    event ERC1155EventCreated(address indexed eventContract);

    function setFeeRecipient(address payable recipient) external onlyOwner {
        feeRecipient = recipient;
    }

    function setServiceFee(uint256 fee) external onlyOwner {
        serviceFee = fee;
    }

    function setERC721Factory(address factory) external onlyOwner {
        ERC721Factory = IFactory(factory);
    }

    function createERC721Event(
        string memory name,
        string memory uri,
        uint256 date,
        uint256[3] memory prices,
        bytes32 salt
    ) external {
        address eventContract = ERC721Factory.createEvent(
            name,
            uri,
            payable(msg.sender),
            feeRecipient,
            serviceFee,
            date,
            prices,
            salt
        );
        events.push(eventContract);
        emit ERC721EventCreated(eventContract);
    }

    function setERC1155Factory(address factory) external onlyOwner {
        ERC1155Factory = IFactory(factory);
    }

    function createERC1155Event(
        string memory name,
        string memory uri,
        uint256 date,
        uint256[3] memory prices,
        bytes32 salt
    ) external {
        address eventContract = ERC1155Factory.createEvent(
            name,
            uri,
            payable(msg.sender),
            feeRecipient,
            serviceFee,
            date,
            prices,
            salt
        );
        events.push(eventContract);
        emit ERC1155EventCreated(eventContract);
    }

    function getEvents() external view returns (address[] memory) {
        return events;
    }

    function getUserTicket(address user) external view returns (LibTicket.TicketInfo[] memory) {
        uint256 length;
        for (uint256 i = 0; i < events.length; i++) {
            length += IEvent(events[i]).getUserTickets(user).length;
        }
        LibTicket.TicketInfo[] memory tickets = new LibTicket.TicketInfo[](length);
        uint256 index;
        for (uint256 i = 0; i < events.length; i++) {
            LibTicket.TicketInfo[] memory userTickets = IEvent(events[i]).getUserTickets(user);
            for (uint256 j = 0; j < userTickets.length; j++) {
                tickets[index] = userTickets[j];
                index++;
            }
        }
        return tickets;
    }
}
