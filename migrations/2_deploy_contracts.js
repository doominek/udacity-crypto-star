const StarNotary = artifacts.require("StarNotary");

module.exports = function(deployer) {
  deployer.deploy(StarNotary, "Domin Crypto Star", "DCS");
};
