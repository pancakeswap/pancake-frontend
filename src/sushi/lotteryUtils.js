import BigNumber from 'bignumber.js'
import { Interface } from '@ethersproject/abi';
import { Contract } from '@ethersproject/contracts';
import { abi as multicallAbi } from './lib/abi/Multicall.json';

export const MULTICALL = {
  1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  56: '0x1ee38d535d541c55c9dae27b12edf090c608e6fb',
  97: '0x67ADCB4dF3931b0C5Da724058ADC2174a9844412'
}

export async function multicall(network, provider, abi, calls, options) {
  const multi = new Contract(MULTICALL[network], multicallAbi, provider);
  const itf = new Interface(abi);
  try {
    const [, response] = await multi.aggregate(
      calls.map(call => [
        call[0].toLowerCase(),
        itf.encodeFunctionData(call[1], call[2])
      ]),
      options || {}
    );
    return response.map((call, i) =>
      itf.decodeFunctionResult(calls[i][1], call)
    );
  } catch (e) {
    return Promise.reject();
  }
}

export const getLotteryContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.lottery
}

export const getTicketsContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.lotteryNft
}

export const buy = async (lotteryContract, amount, numbers, account) => {
  const lotteryNumbers = [
    new BigNumber(numbers[0]),
    new BigNumber(numbers[1]),
    new BigNumber(numbers[2]),
    new BigNumber(numbers[3])
  ];
  return lotteryContract.methods
    .buy(
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
      lotteryNumbers
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const getTickets = async (lotteryContract, ticketsContract, account) => {
  let tickets = []
  let i = 0
  const issueIdex = await lotteryContract.methods.issueIndex().call();
  while(1){
    const tokenId = await ticketsContract.methods.tokenOfOwnerByIndex(account, i).call()
    if(tokenId > 10000000000000000000000000000000000000000000) break
    i++;
    const ticketIssue = await ticketsContract.methods.getLotteryIssueIndex(tokenId).call()
    if(ticketIssue == issueIdex) {
      const numbers = await ticketsContract.methods.getLotteryNumbers(tokenId).call();
      tickets.push(numbers)
    }
  }
  return tickets
}

export const getTotalClaim  = async (lotteryContract, ticketsContract, account) => {
  let claim = new BigNumber(0)
  let i = 0
  const issueIdex = await lotteryContract.methods.issueIndex().call();
  while(1){
    const tokenId = await ticketsContract.methods.tokenOfOwnerByIndex(account, i).call()
    if(tokenId > 10000000000000000000000000000000000000000000) break
    i++;
    const ticketIssue = await ticketsContract.methods.getLotteryIssueIndex(tokenId).call()
    if(ticketIssue == issueIdex) {
      const rewards = await lotteryContract.methods.getRewardView(tokenId).call();
      claim = BigNumber.sum(claim, rewards)
    }
  }
  return claim
}



export const getTotalRewards = async (lotteryContract, account) =>{
  const issueIdex = await lotteryContract.methods.issueIndex().call();
  return lotteryContract.methods.getTotalRewards(issueIdex).call()
}

export const getMatchingRewardLength = async (lotteryContract, matchNumber, account) =>{
  const issueIdex = await lotteryContract.methods.issueIndex().call();
  return lotteryContract.methods.getMatchingRewardLength(issueIdex, matchNumber).call()
}

export const getWinningNumbers = async (lotteryContract, account) => {
  const issueIdex = await lotteryContract.methods.issueIndex().call();
  let numbers = []
  for(let i = 0;i<4;i++) {
    numbers.push((await lotteryContract.methods.winningNumbers(i).call()).toString())
  }
  return numbers
}
