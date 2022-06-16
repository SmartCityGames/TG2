const Helloworld = artifacts.require("HelloWorld");

module.exports = (deployer) => deployer.deploy(Helloworld, "hello world - ctr");
