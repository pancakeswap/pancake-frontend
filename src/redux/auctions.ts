import artists from '../config/constants/artists'

const auctions = [
  {
    aid: 0,
    name: "Patient Zero",
    bidToken: "0x4dbaf6479f0afa9f03c2a7d611151fa5b53ecdc8",
    prizeDescription: 'Not much is known about the origin of the first humans gone zombie. We do know this one loved tacos.',
    artist: { ...artists.jussjoshinduh },
    token0: "BNB",
    token1: "0x50ba8BF9E34f0F83F96a340387d1d3888BA4B3b5"
  }
]

export default auctions