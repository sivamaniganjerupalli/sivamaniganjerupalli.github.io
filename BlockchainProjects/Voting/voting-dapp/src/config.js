// src/config.js

// This is the new, public address of your contract on the Sepolia testnet
export const contractAddress = '0xFD953Ef6Fa10D7fe03454329A8448Fa318Ad229A';

const config = {
  network: {
    // This is the official Chain ID for the Sepolia testnet
    chainId: '0xaa36a7', // Hexadecimal for 11155111

    // These details are not strictly required by the app logic anymore,
    // but are good practice to keep for reference.
    chainName: 'Sepolia Testnet',
    rpcUrls: ['https://sepolia.infura.io/v3/'], // Example public RPC
    blockExplorerUrls: ['https://sepolia.etherscan.io'],
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'ETH',
      decimals: 18,
    },
  },
};

export default config;
