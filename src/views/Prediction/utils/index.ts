import { IRound, IBetInfo } from '../types'

export * from './crop'

function getPreEpochs(currentEpoch: number): number[] {
  let start = currentEpoch
  const preEpochs = []
  while (start > 0 && preEpochs.length <= 3) {
    preEpochs.push(--start)
  }
  return preEpochs
}

export async function getPreRounds(contract, currentEpoch: number): Promise<IRound[]> {
  const preEpochs = getPreEpochs(currentEpoch)
  return Promise.all(preEpochs.map((idx) => contract.methods.rounds(idx).call()))
}

export async function getPreBetInfos(contract, currentEpoch: number, account: string): Promise<IBetInfo[]> {
  const preEpochs = getPreEpochs(currentEpoch)
  const [betInfos, claimables] = await Promise.all([
    Promise.all(preEpochs.map((idx) => contract.methods.ledger(idx, account).call())),
    Promise.all(preEpochs.map((idx) => contract.methods.claimable(idx, account).call())),
  ])
  return betInfos.map((item, idx) => ({
    ...item,
    claimable: claimables[idx] || false,
  }))
}

export function updateRounds(rounds, round) {
  return [...rounds].map(item => {
    if (item.epoch === round.epoch) {
      return {
        ...item,
        claimed: true,
        claimable: false
      }
    }
    return item
  })
}

export function getSecondsToNextRound() {
  const now = new Date()
  const m = now.getMinutes()
  const s = now.getSeconds()
  return (10 - (m % 10)) * 60 - s
}

export default {}
