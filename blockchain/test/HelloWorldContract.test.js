const HelloWorld = artifacts.require("HelloWorld");

contract("HelloWorld", (_accounts) => {
  let helloWorldContract;

  beforeEach(async () => {
    helloWorldContract = await HelloWorld.deployed();
  });

  it("ctr should set the message", async () => {
    const message = await helloWorldContract.getMessage();
    assert.equal(message, "hello world - ctr");
  });

  it("setMessage alters the message", async () => {
    await helloWorldContract.setMessage("new message");
    const message = await helloWorldContract.getMessage();
    assert.equal(message, "new message");
  });
});
