import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.setDefaultAccount(accounts[0]);
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  setDefaultAccount: function(account) {
    this.account = account;
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },

  createStar: async function() {
    const { createStar } = this.meta.methods;
    const name = document.getElementById("starName").value;
    const id = document.getElementById("starId").value;
    await createStar(name, id).send({from: this.account});
    App.setStatus("New Star Owner is " + this.account + ".");
  },

  // Implement Task 4 Modify the front end of the DAPP
  lookUp: async function (){
    const lookUpBtn = document.getElementById("lookUpStarBtn");

    try {
      lookUpBtn.disabled = true;
      const { lookUptokenIdToStarInfo } = this.meta.methods;
      const id = document.getElementById("lookid").value;
      const name = await lookUptokenIdToStarInfo(id).call();
      const message = name ? `The name of the Star with ID: ${id} is <b>${name}</b>` : `Star with ID: ${id} not found`;
      App.setStatus(message);
    } finally {
      lookUpBtn.disabled = false;
    }
  }
};

window.App = App;

window.addEventListener("load", async function() {
  const { ethereum } = window;
  if (ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(ethereum);
    await ethereum.enable(); // get permission to access accounts

    ethereum.on('accountsChanged', (accounts) => {
      App.setDefaultAccount(accounts[0]);
    });
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
  }

  App.start();
});