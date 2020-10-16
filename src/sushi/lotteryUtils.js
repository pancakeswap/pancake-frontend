import BigNumber from 'bignumber.js'
import abi from './lib/abi/lottery.json'
import { Interface } from '@ethersproject/abi';

export const multiBuy = async (sushi, ticketNumbers) => {
  const multicall = sushi && sushi.contracts && sushi.contracts.multicall
  console.log(multicall.methods)
  console.log((await getLotteryContract(sushi))._address)
  console.log((await getLotteryContract(sushi)).options.address)
  const address = (await getLotteryContract(sushi)).options.address
  const itf = new Interface(abi);
  const calls=[
    ['10',[1,2,3,5]],
    ['10',[1,4,3,2]],
    ['5',[2,1,4,3]]
  ]
  const numbers = [1,2,4,3]
  const lotteryNumbers = [
    new BigNumber(numbers[0]),
    new BigNumber(numbers[1]),
    new BigNumber(numbers[2]),
    new BigNumber(numbers[3])
  ];
  console.log(lotteryNumbers)
  try {
    const calldata = calls.map(call => ([
        address.toLowerCase(),
        itf.encodeFunctionData('buy', ['10', ['2','3','4']])
      ]));

    console.log(calldata)
    const {returnData} = await multicall.methods.aggregate(calldata).call()
    console.log(returnData)
    const res =  returnData.map((call, i) =>
      itf.decodeFunctionResult('buy', call)
    );
    console.log(res)
  }
  catch(err) {
    console.log(err)
  }
  // const response = await multicall.methods
  return []
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
