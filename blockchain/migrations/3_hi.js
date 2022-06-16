const Hi = artifacts.require("Hi");
const HelloWorld = artifacts.require("HelloWorld");

module.exports = async (deployer) => {
  const hello = await HelloWorld.deployed();
  const message = await hello.getMessage();
  return deployer.deploy(Hi, `${message} - immutable`);
};
