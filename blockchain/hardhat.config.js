require("@nomicfoundation/hardhat-toolbox");
const config = require("./config");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: './artifacts',
  },
  networks: {
    goerli: {
      url: config.GOERLI_ALCHEMY_URL,
      accounts: [config.GOERLI_WALLET_PRIVATE_KEY]
    },
  }
};
