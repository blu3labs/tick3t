// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IFactory} from "./common/IFactory.sol";

contract FactoryManager is Ownable {
    address payable public feeRecipient;
    uint256 public serviceFee;

    IFactory public ERC721Factory;
    IFactory public ERC1155Factory;

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
            feeRecipient,
            serviceFee,
            date,
            prices,
            salt
        );
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
            feeRecipient,
            serviceFee,
            date,
            prices,
            salt
        );
        emit ERC1155EventCreated(eventContract);
    }
}