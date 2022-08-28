require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  paths: {
    artifacts: './artifacts',
  },
  networks: {
    goerli: {
      url: import.meta.env.GOERLI_ALCHEMY_URL,
      accounts: [import.meta.env.GOERLI_WALLET_PRIVATE_KEY]
    },
  }
};
