// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Factory} from "./common/Factory.sol";
import {ERC721Event} from "../tokens/ERC721/ERC721Event.sol";

contract ERC721Factory is Factory {
    constructor(address factoryManager_) Factory(factoryManager_) {}

    function createEvent(
        string memory name,
        address payable organizer,
        address payable feeRecipient,
        uint256 serviceFee,
        uint256 date,
        uint256[3] memory prices,
        bytes32 salt
    ) external override onlyFactoryManager returns (address){
        ERC721Event eventContract = new ERC721Event{salt: salt}(
            name,
            organizer,
            feeRecipient,
            serviceFee,
            date,
            prices
        );
        return address(eventContract);
    }
}
