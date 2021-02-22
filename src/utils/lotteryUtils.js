/* eslint-disable no-await-in-loop */
import BigNumber from 'bignumber.js'
import { Interface } from '@ethersproject/abi'
import MultiCallAbi from 'config/abi/Multicall.json'
import ticketAbi from 'config/abi/lotteryNft.json'
import lotteryAbi from 'config/abi/lottery.json'
import { LOTTERY_TICKET_PRICE } from 'config'
import { getContract } from 'utils/erc20'
import { getMulticallAddress } from './addressHelpers'

export const multiCall = async (abi, calls) => {
  const multi = getContract(getMulticallAddress(), MultiCallAbi)
  const itf = new Interface(abi)
  let res = []
  if (calls.length > 100) {
    let i = 0
    while (i < calls.length / 100) {
      const newCalls = calls.slice(i * 100, 100 * (i + 1))
      const calldata = newCalls.map((call) => [call[0].toLowerCase(), itf.encodeFunctionData(call[1], call[2])])
      const { returnData } = await multi.aggregate(calldata)
      i++
      res = res.concat(returnData.map((call, index) => itf.decodeFunctionResult(newCalls[index][1], call)))
    }
  } else {
    const calldata = calls.map((call) => [call[0].toLowerCase(), itf.encodeFunctionData(call[1], call[2])])
    const { returnData } = await multi.aggregate(calldata)
    res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i][1], call))
  }
  return res
}

export const multiBuy = async (lotteryContract, price, numbersList, account) => {
  try {
    const tx = await lotteryContract.multiBuy(
      new BigNumber(price).times(new BigNumber(10).pow(18)).toString(),
      numbersList,
      { from: account },
    )
    await tx.wait()
    return tx.hash
  } catch (err) {
    return console.error(err)
  }
}

export const getTickets = async (lotteryContract, ticketsContract, account, customLotteryNum) => {
  try {
    const issueIndex = customLotteryNum || (await lotteryContract.issueIndex()).toString()
    const length = await getTicketsAmount(ticketsContract, account)

    // eslint-disable-next-line prefer-spread
    const calls1 = Array.apply(null, { length }).map((a, i) => [
      ticketsContract.address,
      'tokenOfOwnerByIndex',
      [account, i],
    ])
    const res = await multiCall(ticketAbi, calls1)

    const tokenIds = res.map((id) => id.toString())

    const calls2 = tokenIds.map((id) => [ticketsContract.address, 'getLotteryIssueIndex', [id]])
    const ticketIssues = await multiCall(ticketAbi, calls2)

    const finalTokenids = []
    ticketIssues.forEach(async (ticketIssue, i) => {
      if (new BigNumber(ticketIssue.toString()).eq(new BigNumber(issueIndex))) {
        finalTokenids.push(tokenIds[i])
      }
    })
    const calls3 = finalTokenids.map((id) => [ticketsContract.address, 'getLotteryNumbers', [id]])
    const tickets = await multiCall(ticketAbi, calls3)
    await getLotteryStatus(lotteryContract)
    return tickets
  } catch (e) {
    console.error(e)
    return []
  }
}

export const getTicketsAmount = async (ticketsContract, account) => {
  return ticketsContract.balanceOf(account)
}

export const multiClaim = async (lotteryContract, ticketsContract, account) => {
  await lotteryContract.issueIndex()
  const length = await getTicketsAmount(ticketsContract, account)
  // eslint-disable-next-line prefer-spread
  const calls1 = Array.apply(null, { length }).map((a, i) => [
    ticketsContract.address,
    'tokenOfOwnerByIndex',
    [account, i],
  ])
  const res = await multiCall(ticketAbi, calls1)
  const tokenIds = res.map((id) => id.toString())

  const calls2 = tokenIds.map((id) => [ticketsContract.address, 'getClaimStatus', [id]])
  const claimedStatus = await multiCall(ticketAbi, calls2)

  const unClaimedIds = tokenIds.filter((id, index) => !claimedStatus[index][0])

  const calls3 = unClaimedIds.map((id) => [lotteryContract.address, 'getRewardView', [id]])
  const rewards = await multiCall(lotteryAbi, calls3)

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
    const tx = await lotteryContract.multiClaim(finanltokenIds, { from: account })
    await tx.wait()
    return tx.hash
  } catch (err) {
    return console.error(err)
  }
}

export const getTotalClaim = async (lotteryContract, ticketsContract, account) => {
  try {
    const issueIdex = await lotteryContract.issueIndex()
    const length = (await getTicketsAmount(ticketsContract, account)).toString()
    // eslint-disable-next-line prefer-spread
    const calls1 = Array.apply(null, { length }).map((a, i) => [
      ticketsContract.address,
      'tokenOfOwnerByIndex',
      [account, i],
    ])

    const res = await multiCall(ticketAbi, calls1)
    const tokenIds = res.map((id) => id.toString())
    const calls2 = tokenIds.map((id) => [ticketsContract.address, 'getLotteryIssueIndex', [id]])
    const ticketIssues = await multiCall(ticketAbi, calls2)
    const calls3 = tokenIds.map((id) => [ticketsContract.address, 'getClaimStatus', [id]])
    const claimedStatus = await multiCall(ticketAbi, calls3)
    const drawed = await getLotteryStatus(lotteryContract)

    const finalTokenids = []
    ticketIssues.forEach(async (ticketIssue, i) => {
      // eslint-disable-next-line no-empty
      if (!drawed && ticketIssue.toString() === issueIdex.toString()) {
      } else if (!claimedStatus[i][0]) {
        finalTokenids.push(tokenIds[i])
      }
    })

    const calls4 = finalTokenids.map((id) => [lotteryContract.address, 'getRewardView', [id]])
    const rewards = await multiCall(lotteryAbi, calls4)
    const claim = rewards.reduce((p, c) => BigNumber.sum(p, c), BigNumber(0))

    return claim
  } catch (err) {
    console.error(err)
  }
  return BigNumber(0)
}

export const getTotalRewards = async (lotteryContract) => {
  const issueIdex = await lotteryContract.issueIndex()
  return lotteryContract.getTotalRewards(issueIdex)
}

export const getMax = async (lotteryContract) => {
  return lotteryContract.maxNumber()
}

export const getLotteryIssueIndex = async (lotteryContract) => {
  const issueIndex = await lotteryContract.issueIndex()
  return issueIndex
}

export const getLotteryStatus = async (lotteryContract) => {
  return lotteryContract.drawed()
}

export const getMatchingRewardLength = async (lotteryContract, matchNumber) => {
  let issueIndex = await lotteryContract.issueIndex()
  const drawed = await lotteryContract.drawed()
  if (!drawed) {
    issueIndex -= 1
  }
  try {
    const amount = await lotteryContract.historyAmount(issueIndex, 5 - matchNumber)
    return amount / 1e18 / LOTTERY_TICKET_PRICE
  } catch (err) {
    console.error(err)
  }
  return 0
}

export const getWinningNumbers = async (lotteryContract) => {
  const issueIndex = await lotteryContract.issueIndex()
  const numbers = []
  const drawed = await lotteryContract.drawed()

  if (!drawed && parseInt(issueIndex, 10) === 0) {
    return [0, 0, 0, 0]
  }
  if (!drawed) {
    for (let i = 0; i < 4; i++) {
      numbers.push(+(await lotteryContract.historyNumbers(issueIndex - 1, i)).toString())
    }
  } else {
    for (let i = 0; i < 4; i++) {
      numbers.push(+(await lotteryContract.winningNumbers(i)).toString())
    }
  }
  return numbers
}
