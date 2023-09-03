import dotenv from 'dotenv'
dotenv.config()

export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
      chainId: 1,
      forking: {
        url: `${process.env.FORK_URL}`,
        blockNumber: 15360000,
      },
    },
  },
}
