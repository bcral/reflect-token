
// var REFLECT = artifacts.require("Safemoon");
var reflectToken = artifacts.require("Token");
var BigNumber = require('bignumber.js');

var Config = async function(accounts) {
    
    // These test addresses are useful when you need to add
    // multiple users in test scripts
    let testAddresses = [
        "0x518e4fc4ff59439110cb23735976a03d58ef3b51",
        "0x6ea0287fed663d2201e93cb9f51d3424f1d66c9e",
        "0xae12d8252dc9087bc6ed967c8655f87f68bae9ed",
        "0x51aaca743e4e1b5648d20f4294618a13411b4d81",
        "0xbf15037dfff7c07c776a955f3346005ecee7af83",
        "0x7d875f8bdd01fa61370d292f3aa426df12b50ec4",
        "0x4b428eff5383ca6d47e126771c8732d08aea7cf8",
        "0xfc96e0a541d4f68f71fd586e098b6605a4ab1ecf",
        "0x5f3ea03e6bb1730fdd90af1e69453181f465b6e4",
        "0x746ddd1ec9739774e6e851d596895995c96c73d8"
    ];


    let owner = accounts[0];

    // Throw constructor data as args in the .new() function
    // let reflect = await REFLECT.new();
    reflect = await reflectToken.new();

    return {
        owner: owner,
        reflectToken: reflect,
        testAddresses: testAddresses,
        // To make ETH transactions easier
        weiMultiple: (new BigNumber(10)).pow(18),
    }
}

module.exports = {
    Config: Config
};