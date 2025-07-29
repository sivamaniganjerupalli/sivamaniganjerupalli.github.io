// truffle-config.js

require('dotenv').config();
const { MNEMONIC, ALCHEMY_SEPOLIA_URL } = process.env;
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8556,
      network_id: "*",
    },
    sepolia: {
      provider: () => new HDWalletProvider(MNEMONIC, ALCHEMY_SEPOLIA_URL),
      network_id: 11155111,
      confirmations: 2,
      timeoutBlocks: 200,
      // This new property gives the connection more time before failing.
      // Increased from default (5s) to 90s (90000ms).
      networkCheckTimeout: 90000, 
      skipDryRun: true
    },
  },

  compilers: {
    solc: {
      version: "0.8.20",
    },
  },
};
