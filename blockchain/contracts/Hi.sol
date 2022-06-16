// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

contract Hi {
    string message;

    constructor(string memory _message) {
        message = _message;
    }

    function getMessage() view public returns (string memory) {
        return message;
    }
}
