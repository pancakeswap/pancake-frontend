import dotenv from 'dotenv'
dotenv.config()

export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
      chainId: 5,
      forking: {
        url: `https://goerli.infura.io/v3/3f4ad76a6b444342bde910d098ff8a4e`,
        blockNumber: 9544943,
      },
    },
  },
}
