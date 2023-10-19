// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {ERC721Event} from "../tokens/ERC721/ERC721Event.sol";
import {ERC1155Event} from "../tokens/ERC1155/ERC1155Event.sol";

contract Factory {
    address[] public events;

    event ERC721EventCreated(address indexed eventContract);
    event ERC1155EventCreated(address indexed eventContract);

    function createERC721Event(
        string memory name,
        string memory uri,
        address organizer,
        uint256[3] memory prices,
        bytes32 salt
    ) external {
        ERC721Event eventContract = new ERC721Event{salt: salt}(name, uri, organizer, prices);
        emit ERC721EventCreated(address(eventContract));
    }

    function createERC1155Event(
        string memory name,
        string memory uri,
        address organizer,
        uint256[3] memory prices,
        bytes32 salt
    ) external {
        ERC1155Event eventContract = new ERC1155Event{salt: salt}(name, uri, organizer, prices);
        emit ERC1155EventCreated(address(eventContract));
    }

    function getAllEvents() external view returns (address[] memory) {
        return events;
    }
}