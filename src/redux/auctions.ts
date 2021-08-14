import artists from '../config/constants/artists'
import { Auction } from './types'

const auctions: Auction[] = [
  {
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
    token1: "0x50ba8BF9E34f0F83F96a340387d1d3888BA4B3b5"
  }
]

export default auctions