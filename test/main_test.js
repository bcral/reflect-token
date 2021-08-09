
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('reflect-token.sol', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
  });

  /////////////////////////////////////////////////////////////////////
  // Global setup variables
  var ownerSupply;
  var getTotalSupply;

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`1. Just to make sure this works...`, async function () {

    // Get token name
    let getName = await config.reflectToken.name.call({from: config.owner});
    assert.equal(getName, "Test", "Fetches name of coin from contract");

  });

  it(`2. Check total supply.`, async function () {

    // Get total token supply(in contract)
    getTotalSupply = await config.reflectToken.totalSupply.call({from: config.owner});
    // Total supply should be 10^33
    assert.equal(getTotalSupply, 1000000000000000 * Math.pow(10, 18), "Fetches the total coin supply");

  });

  it(`3. Check balance of owner wallet(address[0])`, async function () {

    // Get balance of owner address
    ownerSupply = await config.reflectToken.balanceOf.call(config.owner, {from: config.owner});
    // Owner balance should be 1 quadrillion, or 1,000,000,000,000,000
    assert.equal(ownerSupply, 1000000000000000 * Math.pow(10, 18), "Owner wallet owns 100% of all tokens");

  });

  it(`4. Send 60% of tokens to testAddresses[1](Wallet B), and then 20% of those tokens to testAddresses[2](Wallet C)`, async function () {

    // Find 60% and 20% of owner's total balance
    let sixtyPercent = 600000000000000 * Math.pow(10, 18);
    let twentyPercent = 200000000000000 * Math.pow(10, 18);
    let sixtyString = BigNumber(sixtyPercent.toString());
    let twentyString = BigNumber(twentyPercent.toString());
    // Send 60% of owner's tokens to testAddresses[1]
    await config.reflectToken.transfer(config.testAddresses[1], sixtyString, {from: config.owner});
    // Send 20% of total tokens to testAddresses[1]
    await config.reflectToken.transfer(config.testAddresses[2], twentyString, {from: config.testAddresses[1]});
    
    let bSupply = await config.reflectToken.balanceOf.call(config.testAddresses[1], {from: config.owner});
    // Wallet B's new balance
    console.log(bSupply.toString())
    assert.equal(bSupply, 402400000000000000000000000000000, "B balance is 40% (+ 3% reflection)");

  });

  it(`5. Check testAccount[2](Wallet C)'s balance`, async function () {

    // Check testAddresses[2] balance    
    let cSupply = await config.reflectToken.balanceOf.call(config.testAddresses[2], {from: config.owner});
    // Wallet C's new balance
    console.log(cSupply.toString())
    assert.equal(cSupply, 195200000000000000000000000000000, "C balance is 20% (less 3% + reflection)");
  });

  it(`6. Check that owner recieved reflection`, async function () {

    // Get balance of owner address
    ownerSupply = await config.reflectToken.balanceOf.call(config.owner, {from: config.owner});
    // owner's new balance
    console.log(ownerSupply.toString())
    assert.equal(ownerSupply, 404040404040404, "Owner balance is 40% (+reflection)");

  });

  it(`7. Check total of all wallets`, async function () {

    // Get total balance of wallets 0 - 2
    let ownerSupply = await config.reflectToken.balanceOf.call(config.owner, {from: config.owner});
    let BSupply = await config.reflectToken.balanceOf.call(config.testAddresses[1], {from: config.owner});
    let CSupply = await config.reflectToken.balanceOf.call(config.testAddresses[2], {from: config.owner});

    walletSupply = new BigNumber.sum(ownerSupply, BSupply, CSupply);
    console.log(walletSupply);
    // Get total token supply(in contract)
    totalSupply = await config.reflectToken.totalSupply.call({from: config.owner});
    
    assert.equal(walletSupply, totalSupply, "Total of all wallets should equal total supply");

  });
  
});
