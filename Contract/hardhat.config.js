require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const API_URL = process.env.INFURA_RPC;
const PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY;
const API_KEY = process.env.API_KEY;

module.exports = {
	solidity: '0.8.19',
	networks: {
		mumbai: {
			url: API_URL,
			accounts: [PRIVATE_KEY],
		},
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [PRIVATE_KEY],
    },
	},
	etherscan: {
		apiKey: API_KEY,
	},
};