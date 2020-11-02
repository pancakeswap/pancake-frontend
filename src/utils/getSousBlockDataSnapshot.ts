import Web3 from 'web3'
import {
  getSousChefContract,
  getSousEndBlock,
  getSousStartBlock,
} from '../sushi/utils'

const getSousBlockDataSnapshot = async (ethereum, sushi, sousId) => {
  if (!ethereum || !sushi) {
    return null
  }

  const web3 = new Web3(ethereum)
  const sousChefContract = getSousChefContract(sushi, sousId)
  const latestBlockNumber = await web3.eth.getBlockNumber()
  const start = await getSousStartBlock(sousChefContract)
  const end = await getSousEndBlock(sousChefContract)
  const blocksRemaining = end - latestBlockNumber

  return {
    latestBlockNumber,
    blocksRemaining,
    start: parseInt(start, 10),
    end: parseInt(end, 10),
    isFinished: blocksRemaining <= 0,
    farmStart: start - latestBlockNumber,
  }
}

export default getSousBlockDataSnapshot
