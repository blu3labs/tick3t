// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.20;

interface IFactory {    
    function createEvent(
        string memory name,
        address payable organizer,
        address payable feeRecipient,
        uint256 serviceFee,
        uint256 date,
        uint256[3] memory prices,
        bytes32 salt
    ) external returns (address);
}