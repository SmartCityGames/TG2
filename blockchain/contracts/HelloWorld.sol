// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

contract HelloWorld {
    string message;

    constructor(string memory _message) {
        setMessage(_message);
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function setMessage(string memory _message) public {
        message = _message;
    }
}
