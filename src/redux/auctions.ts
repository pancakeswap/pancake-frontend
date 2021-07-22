import artists from '../config/constants/artists'
import { getZombieAddress } from '../utils/addressHelpers'

const auctions = [
  {
    aid: 0,
    name: "Patient Zero",
    bidToken: "0x4dbaf6479f0afa9f03c2a7d611151fa5b53ecdc8",
    prizeDescription: 'Not much is known about the origin of the first humans gone zombie. We do know this one loved tacos.',
    artist: artists.jussjoshinduh,
    token0: "BNB",
    token1: getZombieAddress()
  }
]

export default auctions