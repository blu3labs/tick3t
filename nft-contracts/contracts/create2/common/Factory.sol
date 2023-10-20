// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {IFactory} from "./IFactory.sol";

abstract contract Factory {
    address public immutable FactoryManager;

    constructor(address factoryManager_) {
        FactoryManager = factoryManager_;
    }

    modifier onlyFactoryManager() {
        require(msg.sender == FactoryManager, "Only FactoryManager");
        _;
    }

    function createEvent(
        string memory name,
        string memory uri,
        address payable feeRecipient,
        uint256 serviceFee,
        uint256 date,
        uint256[3] memory prices,
        bytes32 salt
    ) external virtual returns (address);
}
