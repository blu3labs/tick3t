// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Factory} from "./common/Factory.sol";
import {ERC1155Event} from "../tokens/ERC1155/ERC1155Event.sol";

contract ERC1155Factory is Factory {
    constructor(address factoryManager_) Factory(factoryManager_) {}

    function createEvent(
        string memory name,
        string memory uri,
        address payable feeRecipient,
        uint256 serviceFee,
        uint256 date,
        uint256[3] memory prices,
        bytes32 salt
    ) external override onlyFactoryManager returns (address){
        ERC1155Event eventContract = new ERC1155Event{salt: salt}(
            name,
            uri,
            feeRecipient,
            serviceFee,
            date,
            prices
        );
        return address(eventContract);
    }
}
