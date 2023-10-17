require("@nomicfoundation/hardhat-toolbox");
require("hardhat-log-remover");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: [
        process.env.PV_KEY
      ],
    },
    mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: [process.env.PV_KEY],
    },
  },
  etherscan: {
    apiKey: {
        bscTestnet: process.env.BSC_TESTNET_API_KEY,
        polygonMumbai: process.env.POLYGON_MUMBAI_API_KEY,
    }
  }
};
