// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      chainId: 56,
      forking: {
        url: `https://bsc.getblock.io/mainnet/?api_key=${process.env.GETBLOCK_APY_KEY}`,

        // You can use a specific block number, leave it unset to use latest block
        // Specifying a block number supposedly increase speed during each execution due to hardhat caches, 
        // however using a too old block throws an error, not sure if it is caused by getblock.io or hardhat itself
         
        // blockNumber: 10071521
      }
    },
  }
}
