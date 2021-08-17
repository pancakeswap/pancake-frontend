import artists from '../config/constants/artists'
import { Auction } from './types'
import { BIG_ZERO } from '../utils/bigNumber'

const auctions: Auction[] = [
  {
    id: 0,
    aid: 0,
    prize: "Patient Zero Alpha",
    prizeSymbol: "PATIENT-ZERO",
    bidToken: "0x4dbaf6479f0afa9f03c2a7d611151fa5b53ecdc8",
    path: "/images/rugZombie/Patient Zero.jpg",
    prizeDescription: 'Not much is known about the origin of the first humans gone zombie. We do know this one loved tacos.',
    isFinished: true,
    artist: { ...artists.jussjoshinduh },
    startingBid: 10,
    bt: 'ZMBE-BNB CAKE LP',
    token0: "BNB",
    token1: "0x50ba8BF9E34f0F83F96a340387d1d3888BA4B3b5",
    version: 'v1',
    exchange: 'Pancakeswap',
    end: 1627271999,
    userInfo: {
      bid: BIG_ZERO,
      paidUnlockFee: false
    },
    auctionInfo: {
      lastBidId: 0,
      bids: [],
      unlockFeeInBnb: BIG_ZERO
    }
  },
  {
    id: 1,
    aid: 0,
    prize: "Patient Zero Beta",
    prizeSymbol: "PATIENT-ZERO",
    bidToken: "0xcaa139138557610fe00f581498f283a789355d14",
    path: "https://storage.googleapis.com/rug-zombie/PatientZeroBeta.png",
    prizeDescription: 'He loves cake.',
    isFinished: false,
    artist: { ...artists.jussjoshinduh },
    startingBid: 10,
    bt: 'ZMBE-BNB APESWAP LP',
    token0: "ETH",
    token1: "0x50ba8BF9E34f0F83F96a340387d1d3888BA4B3b5",
    version: 'v2',
    exchange: 'Apeswap',
    end: 1629691199,
    userInfo: {
      bid: BIG_ZERO,
      paidUnlockFee: false,
    },
    auctionInfo: {
      lastBidId: 0,
      bids: [],
      unlockFeeInBnb: BIG_ZERO
    }
  }
]

export default auctions