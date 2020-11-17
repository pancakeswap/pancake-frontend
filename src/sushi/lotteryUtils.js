import BigNumber from 'bignumber.js'
import { Interface } from '@ethersproject/abi'
import ticketAbi from './lib/abi/lotteryNft.json'
import lotteryAbi from './lib/abi/lottery.json'

export const multiCall = async (sushi, abi, calls) => {
  const multicall = sushi && sushi.contracts && sushi.contracts.multicall
  const itf = new Interface(abi)
  let res = []
  if (calls.length > 100) {
    let i = 0
    while (i < calls.length / 100) {
      const newCalls = calls.slice(i * 100, 100 * (i + 1))
      const calldata = newCalls.map((call) => [call[0].toLowerCase(), itf.encodeFunctionData(call[1], call[2])])
      const { returnData } = await multicall.methods.aggregate(calldata).call()
      i++
      res = res.concat(returnData.map((call, i) => itf.decodeFunctionResult(newCalls[i][1], call)))
    }
  } else {
    const calldata = calls.map((call) => [call[0].toLowerCase(), itf.encodeFunctionData(call[1], call[2])])
    const { returnData } = await multicall.methods.aggregate(calldata).call()
    res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i][1], call))
  }
  return res
}

export const multiBuy = async (lotteryContract, price, numbersList, account) => {
  try {
    return lotteryContract.methods
      .multiBuy(new BigNumber(price).times(new BigNumber(10).pow(18)).toString(), numbersList)
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  } catch (err) {
    return console.error(err)
  }
}

export const getLotteryContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.lottery
}

export const getTicketsContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.lotteryNft
}

export const getTickets = async (sushi, lotteryContract, ticketsContract, account) => {
  const issueIdex = await lotteryContract.methods.issueIndex().call()
  const length = await getTicketsAmount(ticketsContract, account)

  const calls1 = Array.apply(null, { length }).map((a, i) => [
    ticketsContract.options.address,
    'tokenOfOwnerByIndex',
    [account, i],
  ])
  const res = await multiCall(sushi, ticketAbi, calls1)

  const tokenIds = res.map((id) => id.toString())

  const calls2 = tokenIds.map((id) => [ticketsContract.options.address, 'getLotteryIssueIndex', [id]])
  const ticketIssues = await multiCall(sushi, ticketAbi, calls2)

  const finalTokenids = []
  ticketIssues.forEach(async (ticketIssue, i) => {
    if (ticketIssue.toString() === issueIdex) {
      finalTokenids.push(tokenIds[i])
    }
  })
  const calls3 = finalTokenids.map((id) => [ticketsContract.options.address, 'getLotteryNumbers', [id]])
  const tickets = await multiCall(sushi, ticketAbi, calls3)

  await getLotteryStatus(lotteryContract)
  return tickets
}

export const getTicketsAmount = async (ticketsContract, account) => {
  return ticketsContract.methods.balanceOf(account).call()
}

export const multiClaim = async (sushi, lotteryContract, ticketsContract, account) => {
  await lotteryContract.methods.issueIndex().call()
  const length = await getTicketsAmount(ticketsContract, account)
  const calls1 = Array.apply(null, { length }).map((a, i) => [
    ticketsContract.options.address,
    'tokenOfOwnerByIndex',
    [account, i],
  ])
  const res = await multiCall(sushi, ticketAbi, calls1)
  const tokenIds = res.map((id) => id.toString())

  const calls2 = tokenIds.map((id) => [ticketsContract.options.address, 'getClaimStatus', [id]])
  const claimedStatus = await multiCall(sushi, ticketAbi, calls2)

  const unClaimedIds = tokenIds.filter((id, index) => !claimedStatus[index][0])

  const calls3 = unClaimedIds.map((id) => [lotteryContract.options.address, 'getRewardView', [id]])
  const rewards = await multiCall(sushi, lotteryAbi, calls3)

  let finanltokenIds = []
  rewards.forEach((r, i) => {
    if (r > 0) {
      finanltokenIds.push(unClaimedIds[i])
    }
  })

  if (finanltokenIds.length > 200) {
    finanltokenIds = finanltokenIds.slice(0, 200)
  }

  try {
    return lotteryContract.methods
      .multiClaim(finanltokenIds)
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  } catch (err) {
    return console.error(err)
  }
}

export const getTotalClaim = async (sushi, lotteryContract, ticketsContract, account) => {
  try {
    const issueIdex = await lotteryContract.methods.issueIndex().call()
    const length = await getTicketsAmount(ticketsContract, account)
    const calls1 = Array.apply(null, { length }).map((a, i) => [
      ticketsContract.options.address,
      'tokenOfOwnerByIndex',
      [account, i],
    ])
    const res = await multiCall(sushi, ticketAbi, calls1)
    const tokenIds = res.map((id) => id.toString())
    const calls2 = tokenIds.map((id) => [ticketsContract.options.address, 'getLotteryIssueIndex', [id]])
    const ticketIssues = await multiCall(sushi, ticketAbi, calls2)
    const calls3 = tokenIds.map((id) => [ticketsContract.options.address, 'getClaimStatus', [id]])
    const claimedStatus = await multiCall(sushi, ticketAbi, calls3)

    const drawed = await getLotteryStatus(lotteryContract)

    const finalTokenids = []
    ticketIssues.forEach(async (ticketIssue, i) => {
      if (!drawed && ticketIssue.toString() === issueIdex) {
      } else if (!claimedStatus[i][0]) {
        finalTokenids.push(tokenIds[i])
      }
    })

    const calls4 = finalTokenids.map((id) => [lotteryContract.options.address, 'getRewardView', [id]])

    const rewards = await multiCall(sushi, lotteryAbi, calls4)
    const claim = rewards.reduce((p, c) => BigNumber.sum(p, c), BigNumber(0))

    return claim
  } catch (err) {
    console.error(err)
  }
  return BigNumber(0)
}

export const getTotalRewards = async (lotteryContract) => {
  const issueIdex = await lotteryContract.methods.issueIndex().call()
  return lotteryContract.methods.getTotalRewards(issueIdex).call()
}

export const getMax = async (lotteryContract) => {
  return lotteryContract.methods.maxNumber().call()
}

export const getLotteryIssueIndex = async (lotteryContract) => {
  const issueIndex = await lotteryContract.methods.issueIndex().call()
  return issueIndex
}

export const getLotteryStatus = async (lotteryContract) => {
  return lotteryContract.methods.drawed().call()
}

export const getMatchingRewardLength = async (lotteryContract, matchNumber) => {
  let issueIdex = await lotteryContract.methods.issueIndex().call()
  const drawed = await lotteryContract.methods.drawed().call()
  if (!drawed) {
    issueIdex -= 1
  }
  try {
    const amount = await lotteryContract.methods.historyAmount(issueIdex, 5 - matchNumber).call()
    return amount / 1e18 / 10
  } catch (err) {
    console.error(err)
  }
  return 0
}

export const getWinningNumbers = async (lotteryContract) => {
  const issueIdex = await lotteryContract.methods.issueIndex().call()
  const numbers = []
  const drawed = await lotteryContract.methods.drawed().call()
  if (!drawed && issueIdex == 0) {
    return [0, 0, 0, 0]
  }
  if (!drawed) {
    for (let i = 0; i < 4; i++) {
      numbers.push(+(await lotteryContract.methods.historyNumbers(issueIdex - 1, i).call()).toString())
    }
  } else {
    for (let i = 0; i < 4; i++) {
      numbers.push(+(await lotteryContract.methods.winningNumbers(i).call()).toString())
    }
  }
  return numbers
}
