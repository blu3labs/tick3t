// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {LibTicket} from "./LibTicket.sol";

interface IEvent {
    function getUserTickets(address user) external view returns (LibTicket.TicketInfo[] memory);
}
