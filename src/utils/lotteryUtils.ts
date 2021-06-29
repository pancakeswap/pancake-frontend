/* eslint-disable no-await-in-loop */
import BigNumber from 'bignumber.js'
import ticketAbi from 'config/abi/lotteryNft.json'
import lotteryAbi from 'config/abi/lottery.json'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import multicall from './multicall'
import { BIG_ZERO } from './bigNumber'

export const multiBuy = async (lotteryContract, price, numbersList) => {
  try {
    const tx = await lotteryContract.multiBuy(new BigNumber(price).times(DEFAULT_TOKEN_DECIMAL).toString(), numbersList)
    const receipt = await tx.wait()
    return receipt.status
  } catch (err) {
    return console.error(err)
  }
}

export const getTickets = async (lotteryContract, ticketsContract, account, customLotteryNum) => {
  const issueIndex = customLotteryNum || (await lotteryContract.issueIndex())
  const length = await getTicketsAmount(ticketsContract, account)

  // eslint-disable-next-line prefer-spread
  const calls1 = Array.apply(null, { length } as unknown[]).map((a, i) => ({
    address: ticketsContract.address,
    name: 'tokenOfOwnerByIndex',
    params: [account, i],
  }))
  const res = await multicall(ticketAbi, calls1)

  const tokenIds = res.map((id) => id.toString())

  const calls2 = tokenIds.map((id) => ({
    address: ticketsContract.address,
    name: 'getLotteryIssueIndex',
    params: [id],
  }))
  const ticketIssues = await multicall(ticketAbi, calls2)

  const finalTokenids = []
  ticketIssues.forEach(async (ticketIssue, i) => {
    if (new BigNumber(ticketIssue).eq(issueIndex)) {
      finalTokenids.push(tokenIds[i])
    }
  })
  const calls3 = finalTokenids.map((id) => ({
    address: ticketsContract.address,
    name: 'getLotteryNumbers',
    params: [id],
  }))
  const tickets = await multicall(ticketAbi, calls3)

  await getLotteryStatus(lotteryContract)
  return tickets
}

export const getTicketsAmount = async (ticketsContract, account) => {
  return ticketsContract.balanceOf(account)
}

export const multiClaim = async (lotteryContract, ticketsContract, account) => {
  await lotteryContract.issueIndex()
  const length = await getTicketsAmount(ticketsContract, account)
  // eslint-disable-next-line prefer-spread
  const calls1 = Array.apply(null, { length } as unknown[]).map((a, i) => ({
    address: ticketsContract.address,
    name: 'tokenOfOwnerByIndex',
    params: [account, i],
  }))
  const res = await multicall(ticketAbi, calls1)
  const tokenIds = res.map((id) => id.toString())

  const calls2 = tokenIds.map((id) => ({ address: ticketsContract.address, name: 'getClaimStatus', params: [id] }))
  const claimedStatus = await multicall(ticketAbi, calls2)

  const unClaimedIds = tokenIds.filter((id, index) => !claimedStatus[index][0])

  const calls3 = unClaimedIds.map((id) => ({ address: lotteryContract.address, name: 'getRewardView', params: [id] }))
  const rewards = await multicall(lotteryAbi, calls3)

  let finalTokenIds = []
  rewards.forEach((r, i) => {
    if (r > 0) {
      finalTokenIds.push(unClaimedIds[i])
    }
  })

  if (finalTokenIds.length > 200) {
    finalTokenIds = finalTokenIds.slice(0, 200)
  }

  try {
    const tx = await lotteryContract.multiClaim(finalTokenIds)
    const receipt = await tx.wait()
    return receipt.status
  } catch (err) {
    return console.error(err)
  }
}

export const getTotalClaim = async (lotteryContract, ticketsContract, account) => {
  try {
    const issueIndex = await lotteryContract.issueIndex()
    const length = await getTicketsAmount(ticketsContract, account)
    // eslint-disable-next-line prefer-spread
    const calls1 = Array.apply(null, { length } as unknown[]).map((a, i) => ({
      address: ticketsContract.address,
      name: 'tokenOfOwnerByIndex',
      params: [account, i],
    }))
    const res = await multicall(ticketAbi, calls1)
    const tokenIds = res.map((id) => id.toString())
    const calls2 = tokenIds.map((id) => ({
      address: ticketsContract.address,
      name: 'getLotteryIssueIndex',
      params: [id],
    }))
    const ticketIssues = await multicall(ticketAbi, calls2)
    const calls3 = tokenIds.map((id) => ({ address: ticketsContract.address, name: 'getClaimStatus', params: [id] }))
    const claimedStatus = await multicall(ticketAbi, calls3)

    const drawed = await getLotteryStatus(lotteryContract)

    const finalTokenIds = []
    ticketIssues.forEach(async (ticketIssue, i) => {
      // eslint-disable-next-line no-empty
      if (!drawed && ticketIssue.toString() === issueIndex) {
      } else if (!claimedStatus[i][0]) {
        finalTokenIds.push(tokenIds[i])
      }
    })

    const calls4 = finalTokenIds.map((id) => ({
      address: lotteryContract.address,
      name: 'getRewardView',
      params: [id],
    }))

    const rewards = await multicall(lotteryAbi, calls4)
    const claim = rewards.reduce((p, c) => BigNumber.sum(p, c), BIG_ZERO)

    return claim
  } catch (err) {
    console.error(err)
  }
  return BIG_ZERO
}

export const getTotalRewards = async (lotteryContract) => {
  const issueIndex = await lotteryContract.issueIndex()
  return lotteryContract.getTotalRewards(issueIndex)
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
