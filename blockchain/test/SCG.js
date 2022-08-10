const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("NFT SCG", function () {
  it("Should mint and transfer an NFT to someone", async function () {
    const SmartCityGames = await ethers.getContractFactory('SmartCityGames');
    const scg = await SmartCityGames.deploy();
    await scg.deployed();

    const recipient = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const metadataURI = 'cid/test.png';

    let balance = await scg.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newMintedToken = await scg.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.05') });

    await newMintedToken.wait();

    balance = await scg.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect(await scg.isContentOwned(metadataURI)).to.equal(true);
  })
});
