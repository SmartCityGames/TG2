// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Hi {
    string message;

    constructor(string memory _message) {
        message = _message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}
