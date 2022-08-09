<p align="center">
  <h3 align="center">Blockchain</h3>
  <p align="center">
  SCYG
</p>

## About The Project

Project that aims to build and deploy a blockchain with a cryptocuirrency and non-fungible-tokens (NFTs)

### Built With

* [Truffle](https://trufflesuite.com/)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* NodeJS

## Usage

```bash
$ npx hardhat
$ npm install --save-dev @nomicfoundation/hardhat-chai-matchers @nomicfoundation/hardhat-toolbox chai @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts

[1] $ npx hardhat node
[2] $ npx hardhat clean # clean only for development mode
[3] $ npx hardhat compile
[4] $ npx hardhat run scripts/deploy.js --network localhost
[5] $ npx hardhat test
```

## License

Distributed under the MIT License. See [LICENSE](../LICENSE) for more information.
